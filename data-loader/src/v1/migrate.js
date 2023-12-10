const fs = require('fs').promises;
const { parser } = require('./parser');
const jsonFormat = require('json-format');

const inputFilename = process.argv[2] || './data/input.json';
const outputFilename = process.argv[3] || './data/data.json';

let matched = 0;

const mutateItem = (item) => {
  if (item.code) return item;
  item.code = parser.generateCode();
  matched++;
  return item;
};

const processItem = (item) => {
  mutateItem(item);
  if (!item.has_child) return item;

  item.has_child.forEach(processItem);
  return item;
};

const parseData = async (data) => {
  const jsonData = JSON.parse(data);
  const { set: items } = jsonData;
  const result = items.map(processItem);

  return new Promise((resolve) => resolve({ set: result }));
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
    await fs.readFile(fileHandle).then(parseData).then(writeFile);
    console.info(`Complete. ${matched} codes added.`);
  } catch (error) {
    console.error(error);
  } finally {
    if (fileHandle !== undefined) await fileHandle.close();
  }
};

migrate();
