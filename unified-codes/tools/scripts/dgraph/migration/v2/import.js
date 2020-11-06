const excel = require('exceljs');
const dgraph = require('dgraph-js');

const inputFilename = process.argv[2] || './UC Spreadsheet 2.5.xlsm';

const clientStub = new dgraph.DgraphClientStub(`localhost:9080`);
const dgraphClient = new dgraph.DgraphClient(clientStub);

const insertRootNodes = async () => {
  const query = `query {
    DrugCategory as var(func: eq(dgraph.type, Category)) @filter(eq(name, "Drug"))
    ConsumableCategory as var(func: eq(dgraph.type, Category)) @filter(eq(name, "Consumable"))
    OtherCategory as var(func: eq(dgraph.type, Category)) @filter(eq(name, "Other"))
  }`;

  const mutation = new dgraph.Mutation();
  mutation.setSetNquads(`
    uid(DrugCategory) <name> "Drug" .
    uid(ConsumableCategory) <name> "Consumable" .
    uid(OtherCategory) <name> "Other" .
    uid(DrugCategory) <dgraph.type> "Category" .
    uid(ConsumableCategory) <dgraph.type> "Category" .
    uid(OtherCategory) <dgraph.type> "Category" .
    uid(DrugCategory) <code> "933f3f00" .
    uid(ConsumableCategory) <code> "77fcbb00" .
  `);
  // TODO: Source category codes from config or spreadsheet rather than hardcoding

  const req = new dgraph.Request();
  req.setQuery(query);
  req.setMutationsList([mutation]);
  req.setCommitNow(true);

  const txn = dgraphClient.newTxn();
  try {
    await txn.doRequest(req);
  } finally {
    txn.discard();
  }
};

const processRow = async (row) => {
  // Entities
  const productDefinition = [
    {
      type: 'Product',
      name: row.getCell(1).value,
      code: row.getCell(12).value,
    },  
    {
      type: 'Route',
      name: row.getCell(4).value,
      code: row.getCell(13).value,
    },
    {
      type: 'DoseForm',
      name: row.getCell(5).value,
      code: row.getCell(14).value,
    },
    {
      type: 'DoseQualification',
      name: row.getCell(6).value,
      code: row.getCell(15).value,
    }, 
    {
      type: 'DoseUnit',
      name: row.getCell(7).value,
      code: row.getCell(16).value,
    }
  ]

  const synonyms = row.getCell(2).value;
  const combinations = row.getCell(3).value;
  const categoryCode = row.getCell(11).value;

  // Properties
  const gs1 = row.getCell(19).value;
  const rxNavUC2 = row.getCell(20).value;
  const rxNavUC67 = row.getCell(21).value;
  const atc = row.getCell(22).value;
  const ddd = row.getCell(23).value;
  const emlUC2 = row.getCell(24).value;
  const emlUC67 = row.getCell(25).value;
  const unspsc = row.getCell(26).value;
  const nzulmUC2 = row.getCell(27).value;
  const nzulmUC67 = row.getCell(28).value;
  const snomed = row.getCell(29).value;
  const drugbank = row.getCell(30).value;
  const usfda = row.getCell(31).value;

  // Process non-combination drugs first
  const [product] = productDefinition;

  if (!(product.name.indexOf('/') > -1)) {
    const synonymsArray = synonyms ? synonyms.split(',') : [];
    await insertProduct(product.name, product.code, categoryCode, synonymsArray);

    let parentIndex = 0;
    let childIndex = 1;
    while (childIndex < productDefinition.length) {
      if (productDefinition[childIndex].name && productDefinition[childIndex].code) {
        await insertChild(productDefinition[parentIndex], productDefinition[childIndex]);
        parentIndex = childIndex;
      }
      childIndex++;
    }   
  }
};

const insertProduct = async (productName, productCode, categoryCode, synonymsArray) => {
  const query = `query {
    Category as var(func: eq(dgraph.type, Category)) @filter(eq(code, ${categoryCode}))
    Product as var(func: eq(code, ${productCode})) 
  }`;

  let synonymMutation = '';
  for (let i = 0; i < synonymsArray.length; i++) {
    synonymMutation += `uid(Product) <name@alt${i}> "${synonymsArray[i].trim()}" .\n`;
  }

  const mutation = new dgraph.Mutation();
  mutation.setSetNquads(`
    uid(Product) <name> "${productName}" .
    uid(Product) <code> "${productCode}" .
    uid(Product) <dgraph.type> "Product" .
    uid(Category) <children> uid(Product) .
    ${synonymMutation}
  `);

  const req = new dgraph.Request();
  req.setQuery(query);
  req.setMutationsList([mutation]);
  req.setCommitNow(true);

  const txn = dgraphClient.newTxn();
  try {
    await txn.doRequest(req);
    console.log(`Successfully imported ${productName}`);
  } catch (error) {
    console.log(`Error importing ${productName}`);
  } finally {
    txn.discard();
  }
};

const insertChild = async (parent, child) => {
  const query = `query {
    ${parent.type} as var(func: eq(dgraph.type, ${parent.type})) @filter(eq(code, ${parent.code})) 
    ${child.type} as var(func: eq(dgraph.type, ${child.type})) @filter(eq(code, ${child.code}))
  }`;

  const mutation = new dgraph.Mutation();
  mutation.setSetNquads(`
    uid(${child.type}) <name> "${child.name}" .
    uid(${child.type}) <code> "${child.code}" .
    uid(${child.type}) <dgraph.type> "${child.type}" .
    uid(${parent.type}) <children> uid(${child.type}) .
  `);

  const req = new dgraph.Request();
  req.setQuery(query);
  req.setMutationsList([mutation]);
  req.setCommitNow(true);

  const txn = dgraphClient.newTxn();
  try {
    await txn.doRequest(req);
  } catch (error) {
  } finally {
    txn.discard();
  }
};

const createImport = async () => {
  let fileHandle;

  if (!inputFilename) {
    console.error('\nError! Input filename is required.\n');
    console.info('usage: \n node import.js [input filename]\n');
    return;
  }

  try {
    const workbook = new excel.Workbook();
    await workbook.xlsx.readFile(inputFilename);
    const worksheet = workbook.worksheets[0];

    // Start at second row (ignore header). Intentionally synchronous (insertions rely on previous ones finishing first)
    for (let i = 2; i <= worksheet.rowCount; i++) {
      const row = worksheet.getRow(i);
      await processRow(row);
    }
  } catch (error) {
    console.error(error);
  } finally {
    if (fileHandle !== undefined) await fileHandle.close();
  }
};

insertRootNodes();
createImport();
