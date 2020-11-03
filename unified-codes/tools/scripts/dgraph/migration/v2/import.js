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

  await dgraphClient.newTxn().doRequest(req);
};

const processRow = (row, rowNumber) => {
  // Ignore header
  if (rowNumber === 1) return;

  const categoryCode = row.getCell(9).value;
  const product = row.getCell(1).value;
  const productCode = row.getCell(10).value;

  // Process non combination drugs first
  if (!(product.indexOf('/') > -1)) {
    insertProduct(product, productCode, categoryCode);
  }
};

const insertProduct = async (product, productCode, categoryCode) => {
  const query = `query {
    Category as var(func: eq(dgraph.type, Category)) @filter(eq(code, ${categoryCode}))
    Product as var(func: eq(code, ${productCode})) 
  }`;

  const mutation = new dgraph.Mutation();
  mutation.setSetNquads(`
    uid(Product) <name> "${product}" .
    uid(Product) <code> "${productCode}" .
    uid(Product) <dgraph.type> "Product" .
    uid(Category) <children> uid(Product) .
  `);

  const req = new dgraph.Request();
  req.setQuery(query);
  req.setMutationsList([mutation]);
  req.setCommitNow(true);

  try {
    await dgraphClient.newTxn().doRequest(req);
  } catch (error) {
    console.log(`Error importing ${product}`);
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
    worksheet.eachRow(processRow);
  } catch (error) {
    console.error(error);
  } finally {
    if (fileHandle !== undefined) await fileHandle.close();
  }
};

insertRootNodes();
createImport();
