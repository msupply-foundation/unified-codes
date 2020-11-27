import { CSVParser } from './DataParser';
import { JSONLoader } from './DataLoader';

const hostname = 'localhost';
const port = '9080';
const path = './data/v2/products.csv';

const main = async () => {
    const parser = new CSVParser(path);

    await parser.parseData();
    parser.buildTree();

    if (parser.validateTree()) {
        const loader = new JSONLoader(hostname, port);
        await loader.load(await parser.getTree());
    }
}

main();