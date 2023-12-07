const fs = require('fs').promises;
const excel = require('exceljs');

//const { parser } = require('./parser');
//const jsonFormat = require('json-format');

const inputFilename = process.argv[2] || './data/data.json';
const outputFilename = process.argv[3] || './data/products.xlsx';
const items = [];

const parseFile = async (data) => {
  const jsonData = JSON.parse(data);
  const { set } = jsonData;
  const parent = { form: '', formCategory: '', product: { code: '', description: '' } };

  set.forEach((item) => parseProduct(item, parent));

  return new Promise((resolve) => resolve());
};

const parseChildren = (children, parent) => {
  if (children) {
    children.forEach((child) => parseProduct(child, parent));
  }
};

const getProperty = (properties, type) => {
  if (!properties) return '';
  const prop = properties.find((p) => p.type === type);
  return prop ? prop.value : '';
};

const addPropertiesToProduct = (product, properties) => {
  product.strength = getProperty(properties, 'strength');
  product.ddd = getProperty(properties, 'ddd');
  product.rxnav = getProperty(properties, 'code_rxnav');
  product.eml = getProperty(properties, 'who_eml');
  product.atc = getProperty(properties, 'code_who_atc');
  product.unspsc = getProperty(properties, 'code_unspsc');
  product.nzulm = getProperty(properties, 'code_nzulm');
};

const getProduct = (item, parent) => {
  const { code, description, type } = item;
  const product = {
    code,
    description,
    type,
    form: parent.form,
    formCategory: parent.formCategory,
    product: parent.product,
  };
  addPropertiesToProduct(product, item.has_property);
  return product;
};

const parseProduct = (item, parent) => {
  const { code, description, type } = item;
  switch (item.type) {
    case 'unit_of_use':
      items.push(getProduct(item, parent));
      break;
    case 'other':
    case 'drug':
    case 'medicinal_product':
      if (item.has_child) {
        parent.product = { code, description, type };
        addPropertiesToProduct(parent.product, item.has_property);
        parseChildren(item.has_child, parent);
      } else {
        items.push(getProduct(item, parent));
      }
      break;
    case 'form':
      parent.form = description;
      parseChildren(item.has_child, parent);
      break;
    case 'form_category':
      parent.formCategory = description;
      parseChildren(item.has_child, parent);
      break;
  }
};

const sortItems = (itemA, itemB) => {
  const descriptionA = itemA.description.substring(0, 5).toUpperCase();
  const descriptionB = itemB.description.substring(0, 5).toUpperCase();
  if (descriptionA < descriptionB) {
    return -1;
  }
  if (descriptionA > descriptionB) {
    return 1;
  }

  const formCategoryA = itemA.formCategory;
  const formCategoryB = itemB.formCategory;
  if (formCategoryA < formCategoryB) {
    return -1;
  }
  if (formCategoryA > formCategoryB) {
    return 1;
  }

  const formA = itemA.form;
  const formB = itemB.form;
  if (formA < formB) {
    return -1;
  }
  if (formA > formB) {
    return 1;
  }

  return 0;
};
const writeFile = async () => {
  const workbook = new excel.Workbook();
  const worksheet = workbook.addWorksheet('Products');
  let rowNum = 2;

  worksheet.columns = [
    { header: 'Product Code', key: 'product_code', width: 15 },
    { header: 'Product', key: 'product_description', width: 32 },
    { header: 'Type', key: 'product_type', width: 15 },
    { header: 'DDD', key: 'product_ddd', width: 15 },
    { header: 'RxNav', key: 'product_rxnav', width: 15 },
    { header: 'WHO EML', key: 'product_eml', width: 15 },
    { header: 'WHO ATC', key: 'product_atc', width: 15 },
    { header: 'UNSPSC', key: 'product_unspsc', width: 15 },
    { header: 'NZULM', key: 'product_nzulm', width: 15 },
    { header: 'Form Category', key: 'form_category', width: 15 },
    { header: 'Form', key: 'form', width: 15 },
    { header: 'Item Code', key: 'item_code', width: 10 },
    { header: 'Item', key: 'item_description', width: 50 },
    { header: 'Strength', key: 'item_strength', width: 30 },
    { header: 'DDD', key: 'item_ddd', width: 15 },
    { header: 'RxNav', key: 'item_rxnav', width: 15 },
    { header: 'WHO EML', key: 'item_eml', width: 15 },
    { header: 'WHO ATC', key: 'item_atc', width: 15 },
    { header: 'UNSPSC', key: 'item_unspsc', width: 15 },
    { header: 'NZULM', key: 'item_nzulm', width: 15 },
  ];
  worksheet.getRow(1).font = { bold: true };

  items.sort(sortItems).forEach((item, n) => {
    const row = worksheet.getRow(rowNum++);
    let cell = 1;
    row.getCell(cell++).value = item.product.code;
    row.getCell(cell++).value = item.product.description;
    row.getCell(cell++).value = item.product.type;
    row.getCell(cell++).value = item.product.ddd;
    row.getCell(cell++).value = item.product.rxnav;
    row.getCell(cell++).value = item.product.eml;
    row.getCell(cell++).value = item.product.atc;
    row.getCell(cell++).value = item.product.unspsc;
    row.getCell(cell++).value = item.product.nzulm;
    row.getCell(cell++).value = item.formCategory;
    row.getCell(cell++).value = item.form;
    row.getCell(cell++).value = item.code;
    row.getCell(cell++).value = item.description;
    row.getCell(cell++).value = item.strength;
    row.getCell(cell++).value = item.ddd;
    row.getCell(cell++).value = item.rxnav;
    row.getCell(cell++).value = item.eml;
    row.getCell(cell++).value = item.atc;
    row.getCell(cell++).value = item.unspsc;
    row.getCell(cell++).value = item.nzulm;
  });
  await workbook.xlsx.writeFile(outputFilename);
};

const exportItems = async () => {
  let fileHandle;

  if (!inputFilename || !outputFilename) {
    console.error('\nError! both input and output filenames are required.\n');
    console.info('usage: \n node export.js [input filename] [output filename ]\n');
    return;
  }

  try {
    fileHandle = await fs.open(inputFilename, 'r');
    await fs.readFile(fileHandle).then(parseFile).then(writeFile);
  } catch (error) {
    console.error(error);
  } finally {
    if (fileHandle !== undefined) await fileHandle.close();
  }
};

exportItems();
