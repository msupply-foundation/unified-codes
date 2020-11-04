const excel = require('exceljs');
const dgraph = require('dgraph-js');

const inputFilename = process.argv[2] || './UC Spreadsheet 2.4.xlsm';

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
  const categoryCode = row.getCell(9).value;
  const product = row.getCell(1).value;
  const productCode = row.getCell(10).value;

  // Process non combination drugs first
  if (!(product.indexOf('/') > -1)) {
    const nameArray = product.split('(');
    const [officialName] = nameArray;
    const synonymString = nameArray[1] ? nameArray[1].slice(0, -1) : '';
    const synonymList = synonymString ? synonymString.split(',') : [];

    await insertProduct(officialName.trim(), productCode, categoryCode, synonymList);
  }
};

const insertProduct = async (productName, productCode, categoryCode, synonyms) => {
  const query = `query {
    Category as var(func: eq(dgraph.type, Category)) @filter(eq(code, ${categoryCode}))
    Product as var(func: eq(code, ${productCode})) 
  }`;

  let synonymMutation = '';
  for (let i = 0; i < synonyms.length; i++) {
    synonymMutation += `uid(Product) <name@alt${i}> "${synonyms[i]}" .\n`
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
    console.log(`Successfully imported ${productName}`)
  } catch (error) {
    console.log(`Error importing ${productName}`);
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
