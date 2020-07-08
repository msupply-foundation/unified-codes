const fs = require('fs').promises;
const { parse } = require('./parser');

const inputFilename = process.argv[2] || './data/items.json';
const outputFilename = process.argv[3] || './result.json';

const parseFile = async (data) => {
  const jsonData = JSON.parse(data);
  const { item: items } = jsonData;
  const result = parse(items);

  return new Promise((resolve) => resolve(result));
};

const writeFile = async (jsonData) => {
  await fs.writeFile(outputFilename, JSON.stringify(jsonData));
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
