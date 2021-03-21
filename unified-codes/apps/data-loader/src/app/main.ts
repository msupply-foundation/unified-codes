import path from 'path';

import { CSVParser } from './v2/DataParser';
import { JSONLoader } from './v2/DataLoader';

const hostname = 'localhost';
const port = '9080';

const dirPath = '../../../data';
const filePath = 'v2/products.csv';

const data = path.resolve(__dirname, `${dirPath}/${filePath}`);

const main = async () => { 
  const parser = new CSVParser(data);
  
  await parser.parseData();
  parser.buildGraph();

  if (parser.isValid()) {
    const loader = new JSONLoader(hostname, port);
    try {
      const graph = await parser.getGraph();
      // console.log(JSON.stringify(graph));
      await loader.load(graph);
    } catch (err) {
      console.log(`Failed to load data due to following error: ${err}`);
    }
  } else {
    const cycles = parser.detectCycles();
    console.log(`Failed to load data due to cycles in data: ${cycles}`);
  }
};

main();
