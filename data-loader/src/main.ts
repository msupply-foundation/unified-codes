import path from 'path';

import { DataLoader, DataParser, SchemaParser } from './v2';

import propertyConfigItems from '../data/v2/properties.json';
import { ConfigItemsDataParser } from './v2/ConfigItemsParser';

const hostname = 'localhost';
const port = '9080';

const dirPath = '../data';
const schemaPath = 'v2/schema.gql';
const drugDataPath = 'v2/drugs.csv';
const consumableDataPath = 'v2/consumables.csv';
const vaccineDataPath = 'v2/vaccines.csv';
const configItemsDataPath = 'v2/config_items.csv';

const schemaFile = path.resolve(__dirname, `${dirPath}/${schemaPath}`);
const drugDataFile = path.resolve(__dirname, `${dirPath}/${drugDataPath}`);
const consumableDataFile = path.resolve(
  __dirname,
  `${dirPath}/${consumableDataPath}`
);
const vaccineDataFile = path.resolve(
  __dirname,
  `${dirPath}/${vaccineDataPath}`
);
const configItemsDataFile = path.resolve(
  __dirname,
  `${dirPath}/${configItemsDataPath}`
);

const main = async () => {
  const schemaParser = new SchemaParser(schemaFile);
  await schemaParser.parseSchema();

  const dataParser = new DataParser({
    drugs: drugDataFile,
    consumables: consumableDataFile,
    vaccines: vaccineDataFile,
  });

  const configItemsParser = new ConfigItemsDataParser(configItemsDataFile);

  await dataParser.parseData();
  await configItemsParser.parseData();

  dataParser.buildGraph();

  if (dataParser.isValid()) {
    const schema = schemaParser.getSchema();
    const graph = dataParser.getGraph();
    const configItems = configItemsParser.getItems();

    try {
      const loader = new DataLoader(hostname, port);
      await loader.load(schema, graph, configItems, propertyConfigItems);
    } catch (err) {
      console.log(`Failed to load data due to following error: ${err}`);
    }
  } else {
    const cycles = dataParser.detectCycles();
    console.log(`Failed to load data due to cycles in data: ${cycles}`);
  }
};

main();
