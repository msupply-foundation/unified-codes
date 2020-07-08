const fs = require('fs').promises;
const { parser } = require('./parser');
const jsonFormat = require('json-format');

const inputFilename = process.argv[2] || './data/items.json';
const outputFilename = process.argv[3] || './result.json';

const parseFile = async (data) => {
  const jsonData = JSON.parse(data);
  const { item: items } = jsonData;
  const result = parser.parse(items);

  return new Promise((resolve) => resolve(result));
};

const writeFile = async (jsonData) => {
  await fs.writeFile(outputFilename, jsonFormat(jsonData));
};

const migrate = async () => {
  let fileHandle;

  if (!inputFilename || !outputFilename) {
    console.error('\nError! both input and output filenames are required.\n');
    console.info('usage: \n node migrate.js [input filename] [output filename ]\n');
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

migrate();
