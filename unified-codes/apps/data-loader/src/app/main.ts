import path from 'path';

import { DataLoader, DataParser, SchemaParser } from './v2';

const hostname = process.env.NX_DGRAPH_SERVICE_RPC_HOST;
const port = process.env.NX_DGRAPH_SERVICE_RPC_PORT;

const dirPath = '../../../data';
const schemaPath = 'v2/schema.gql';
const dataPath = 'v2/products.csv';

const schemaFile = path.resolve(__dirname, `${dirPath}/${schemaPath}`);
const dataFile = path.resolve(__dirname, `${dirPath}/${dataPath}`);

const main = async () => {
  const schemaParser = new SchemaParser(schemaFile);
  await schemaParser.parseSchema();

  const dataParser = new DataParser(dataFile);
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
}

main();