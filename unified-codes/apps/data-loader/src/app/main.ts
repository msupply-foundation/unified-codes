import path from 'path';

import { CSVParser } from './v2/CSVParser';
import DgraphClient from './v2/DgraphClient';
import { DgraphLoader } from './v2/DgraphLoader';

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
    const dgraph = new DgraphClient(hostname, port);

    dgraph.alter(`
      type Property {
        type
        value
      }
      
      type Category {
        code
        name
        children
        properties
      }
      
      type Product {
        code
        name
        combines
        children
        properties
      }
      
      type Route {
        code
        name
        children
        properties
      }
      
      type DoseForm {
        code
        name
        children
        properties
      }
      
      type DoseFormQualifier {
        code
        name
        children
        properties
      }
      
      type DoseStrength {
        code
        name
        children
        properties
      }
      
      type DoseUnit {
        code
        name
        children
        properties
      }
      
      type PackImmediate {
        code
        name
        children
        properties
      }
      
      type PackSize {
        code
        name
        children
        properties
      }
      
      type PackOuter {
        code
        name
        children
        properties
      }
      
      code: string @index(exact, fulltext).
      name: string @lang @index(exact, term, trigram) .
      type: string @index(term) .
      value: string .
      combines: [uid] .
      properties: [uid] .
      children: [uid] @reverse . 
    `);

    const loader = new DgraphLoader(dgraph);

    try {
      const graph = await parser.getGraph();
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
