import path from 'path';

import { DataLoader, DataParser, SchemaParser } from './v2';

const hostname = 'localhost';
const port = '9080';

const dirPath = '../data';
const schemaPath = 'v2/schema.gql';
const drugDataPath = 'v2/drugs.csv';

const schemaFile = path.resolve(__dirname, `${dirPath}/${schemaPath}`);
const drugDataFile = path.resolve(__dirname, `${dirPath}/${drugDataPath}`);

const main = async () => {
  const schemaParser = new SchemaParser(schemaFile);
  await schemaParser.parseSchema();

  const dataParser = new DataParser({
    drugs: drugDataFile,
    consumables: 'todo',
    vaccines: 'todo',
  });

  await dataParser.parseData();

  dataParser.buildGraph();

  if (dataParser.isValid()) {
    const schema = schemaParser.getSchema();
    const graph = dataParser.getGraph();

    try {
      const loader = new DataLoader(hostname, port);
      await loader.load(schema, graph);
    } catch (err) {
      console.log(`Failed to load data due to following error: ${err}`);
    }
  } else {
    const cycles = dataParser.detectCycles();
    console.log(`Failed to load data due to cycles in data: ${cycles}`);
  }
};

main();
