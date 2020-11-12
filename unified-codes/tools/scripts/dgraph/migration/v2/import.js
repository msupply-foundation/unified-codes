const excel = require('exceljs');
const dgraph = require('dgraph-js');

const inputFilename = process.argv[2] || './UC Spreadsheet 3.0.xlsm';

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
  const productName = row.getCell(1).value;
  const synonyms = row.getCell(2).value;
  const combinations = row.getCell(3).value;
  const routeName = row.getCell(4).value;
  const doseFormName = row.getCell(5).value;
  const doseQualificationName = row.getCell(6).value;
  const doseStrengthName = row.getCell(7).value;
  const doseUnitName = row.getCell(8).value;
  const immediatePackagingName = row.getCell(9).value;
  const packSizeName = row.getCell(10).value;
  const outerPackagingName = row.getCell(11).value;

  const categoryCode = row.getCell(12).value;
  const productCode = row.getCell(13).value;
  const routeCode = row.getCell(14).value;
  const doseFormCode = row.getCell(15).value;
  const doseQualificationCode = row.getCell(16).value;
  const doseStrengthCode = row.getCell(17).value;
  const doseUnitCode = row.getCell(18).value;
  const immediatePackagingCode = row.getCell(19).value;
  const packSizeCode = row.getCell(20).value;
  const outerPackagingCode = row.getCell(21).value;

  // Properties
  const gs1 = row.getCell(22).value;
  const rxNavUC2 = row.getCell(23).value;
  const rxNavUC67 = row.getCell(24).value;
  const atcUC2 = row.getCell(25).value;
  const dddUC2 = row.getCell(26).value;
  const atcUC5 = row.getCell(27).value;
  const dddUC5 = row.getCell(28).value;
  const emlUC2 = row.getCell(29).value;
  const emlUC67 = row.getCell(30).value;
  const unspsc = row.getCell(31).value;
  const nzulmUC2 = row.getCell(32).value;
  const nzulmUC67 = row.getCell(33).value;
  const snomed = row.getCell(34).value;
  const drugbank = row.getCell(35).value;
  const usfda = row.getCell(36).value;

  const productDefinition = [
    {
      type: 'Product',
      name: productName,
      code: productCode,
      properties: [
        { type: 'code_nzulm', value: nzulmUC2 },
        { type: 'code_rxnav', value: rxNavUC2 },
        { type: 'code_unspsc', value: unspsc },
        { type: 'code_who_atc', value: atcUC2 },
        { type: 'ddd', value: dddUC2 },
        { type: 'who_eml', value: emlUC2 },
      ],
    },
    {
      type: 'Route',
      name: routeName,
      code: routeCode,
      properties: [],
    },
    {
      type: 'DoseForm',
      name: doseFormName,
      code: doseFormCode,
      properties: [],
    },
    {
      type: 'DoseQualification',
      name: doseQualificationName,
      code: doseQualificationCode,
      properties: [
        { type: 'code_who_atc', value: atcUC5 },
        { type: 'ddd', value: dddUC5 },
      ],
    },
    {
      type: 'DoseStrength',
      name: doseStrengthName,
      code: doseStrengthCode,
      properties: []
    },
    {
      type: 'DoseUnit',
      name: doseUnitName,
      code: doseUnitCode,
      properties: []
    },
  ];

  // Process non-combination drugs first
  const [product] = productDefinition;

  if (!(product.name.indexOf('/') > -1)) {
    const synonymsArray = synonyms ? synonyms.split(',') : [];
    await insertProduct(product, categoryCode, synonymsArray);

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

const insertProduct = async (product, categoryCode, synonymsArray) => {
  // const propertiesQueries = propertyQueriesForNode(product);
  // const propertiesMutations = propertyMutationsForNode(product);

  const query = `query {
    Category as var(func: eq(dgraph.type, Category)) @filter(eq(code, ${categoryCode}))
    ${product.type} as var(func: eq(code, ${product.code})) 
  }`;

  const synonymMutation = synonymsArray.reduce(
    (mutation, synonym, i) =>
      `${mutation}uid(${product.type}) <name@alt${i}> "${synonym.trim()}" .\n`,
    ''
  );
  const mutation = new dgraph.Mutation();
  mutation.setSetNquads(`
    uid(${product.type}) <name> "${product.name}" .
    uid(${product.type}) <code> "${product.code}" .
    uid(${product.type}) <dgraph.type> "${product.type}" .
    uid(Category) <children> uid(${product.type}) .
    ${synonymMutation}
  `);

  const req = new dgraph.Request();
  req.setQuery(query);
  req.setMutationsList([mutation]);
  req.setCommitNow(true);

  const txn = dgraphClient.newTxn();
  try {
    await txn.doRequest(req);
    console.log(`Successfully imported ${product.name}`);
  } catch (error) {
    console.log(`Error importing ${product.name}`);
  } finally {
    txn.discard();
  }
};

const insertChild = async (parent, child) => {
  // const propertiesQueries = propertyQueriesForNode(child);
  // const propertiesMutations = propertyMutationsForNode(child);

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

const propertyQueriesForNode = (node) =>
  node.properties.reduce(
    (query, property, i) =>
      property.value
        ? `${query}q${i}(func: eq(dgraph.type, ${node.type})) @filter(eq(code, ${node.code})) {
          properties @filter(eq(type, ${property.type})) {
            propUid${i} as type
          }
        }\n`
        : ``,
    ''
  );

const propertyMutationsForNode = (node) =>
  node.properties.reduce(
    (mutation, property, i) =>
      property.value
        ? `${mutation}uid(propUid${i}) <type> "${property.type}" .
      uid(propUid${i}) <value> "${property.value}" .
      uid(propUid${i}) <dgraph.type> "Property" .
      uid(${node.type}) <properties> uid(propUid${i}) .\n`
        : ``,
    ''
  );

insertRootNodes();
createImport();
