const fs = require('fs').promises;
const excel = require('exceljs');
const jsonFormat = require('json-format');

const inputFilename = process.argv[2] || './products.xlsx';
const outputFilename = process.argv[3] || './import.json';
const items = [];

const properties = [
  'code',
  'title',
  'type',
  'ddd',
  'rxnav',
  'eml',
  'atc',
  'unspsc',
  'nzulm',
  'form_category',
  'form',
  'code',
  'title',
  'strength',
  'ddd',
  'rxnav',
  'eml',
  'atc',
  'unspsc',
  'nzulm',
];
const addPropertiesToProduct = (product, colNumber, value) => {
  const property = properties[colNumber - 1];
  product[property] = value;
};

const convertItemToProduct = (item) => {
  const { code, title: description, type, has_child } = item;
  const product = {
    code,
    description,
    has_child,
    has_property: [],
    type,
  };
  //if (item.type) product.type = item.type;
  if (item.strength) {
    product.has_property.push({ value: item.strength, type: 'strength' });
  }
  if (item.ddd) {
    product.has_property.push({ value: item.ddd, type: 'ddd' });
  }
  if (item.rxnav) {
    product.has_property.push({ value: item.rxnav, type: 'code_rxnav' });
  }
  if (item.eml) {
    product.has_property.push({ value: item.eml, type: 'who_eml' });
  }
  if (item.atc) {
    product.has_property.push({ value: item.atc, type: 'code_who_atc' });
  }
  if (item.unspsc) {
    product.has_property.push({ value: item.unspsc, type: 'code_unspsc' });
  }
  if (item.nzulm) {
    product.has_property.push({ value: item.nzulm, type: 'code_nzulm' });
  }
  if (!product.has_property.length) return { code, description, has_child, type };

  return product;
};

const processRow = (row, rowNumber) => {
  if (rowNumber === 1) return;

  let parent = {};
  let isNewParent = false;
  let isValidParent = true;
  const item = { type: 'unit_of_use' };
  row.eachCell((cell, colNumber) => {
    if (colNumber === 1) {
      parent = items.find((x) => x.code === cell.value);
      isNewParent = !parent;
      isValidParent = !!cell.value;
      if (isNewParent) parent = {};
    }

    if (colNumber < 10) {
      if (isNewParent && isValidParent) addPropertiesToProduct(parent, colNumber, cell.value);
    } else {
      addPropertiesToProduct(item, colNumber, cell.value);
    }
  });

  if (item.form_category && !parent.has_child && isValidParent) parent.has_child = [];

  if (isNewParent && isValidParent) {
    parent = convertItemToProduct(parent);
    items.push(parent);
  }

  // this item has no parent in the spreadsheet
  // needs to be added at the top level
  if (!item.form_category || !isValidParent) {
    items.push(convertItemToProduct(item));
    return;
  }

  let formCategory = (parent.has_child || []).find(
    (x) => x.type === 'form_category' && x.description === item.form_category
  );

  if (!formCategory) {
    formCategory = {
      description: item.form_category,
      type: 'form_category',
      has_child: [],
    };
    parent.has_child.push(formCategory);
  }

  let form = formCategory.has_child.find((x) => x.type === 'form' && x.description === item.form);
  if (!form) {
    form = {
      description: item.form,
      type: 'form',
      has_child: [],
    };
    formCategory.has_child.push(form);
  }

  form.has_child.push(convertItemToProduct(item));
};

const writeFile = async () => {
  const jsonData = { set: items };
  await fs.writeFile(outputFilename, jsonFormat(jsonData));
};

const createImport = async () => {
  let fileHandle;

  if (!inputFilename || !outputFilename) {
    console.error('\nError! both input and output filenames are required.\n');
    console.info('usage: \n node export.js [input filename] [output filename ]\n');
    return;
  }

  try {
    const workbook = new excel.Workbook();
    await workbook.xlsx.readFile(inputFilename);
    const worksheet = workbook.worksheets[0];
    worksheet.eachRow(processRow);
    await writeFile();
  } catch (error) {
    console.error(error);
  } finally {
    if (fileHandle !== undefined) await fileHandle.close();
  }
};

createImport();
