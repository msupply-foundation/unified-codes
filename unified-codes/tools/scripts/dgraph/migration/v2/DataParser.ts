import * as csv from 'csv-parser';
import * as fs from "fs";

interface IRow {
    product: string;
    //product_synonym,
    combination: string;
    route: string;
    dose_form: string;
    dose_qualification: string;
    strength: string;
    //unit_of_presentation,
    //immediate_packaging,
    //pack_size,
    //outer_packaging,
    uc1: string;
    uc2: string;
    uc3: string;
    uc4: string;
    uc5: string;
    uc6: string;
    //uc7,
    //uc8, 
    //uc9
}

type IData = IRow[];

interface INode {
    code: string;
    name?: string;
    type?: string;
    combines?: INode[];
    properties?: INode[];
    children?: INode[];
}

type IGraph = { [code: string]: INode };

enum UCCode {
    Drug = '933f3f00',
    Consumable = '77fcbb00'
}

export abstract class DataParser {
    public readonly path: fs.PathLike;
    public readonly options: string | {
        flags?: string;
        encoding?: BufferEncoding;
        fd?: number;
        mode?: number;
        autoClose?: boolean;
        emitClose?: boolean;
        start?: number;
        end?: number;
        highWaterMark?: number;
    }

    protected data: IData;
    protected graph: IGraph;
    protected cycles: INode[];

    protected isParsed: boolean;
    protected isBuilt: boolean;
    protected isTraversed: boolean;


    constructor(path: fs.PathLike, options?: string | {
        flags?: string;
        encoding?: BufferEncoding;
        fd?: number;
        mode?: number;
        autoClose?: boolean;
        emitClose?: boolean;
        start?: number;
        end?: number;
        highWaterMark?: number;
    }) {
        this.path = path;
        this.options = options;

        this.isParsed = false;
        this.isBuilt = false;
        this.isTraversed = false;

        this.data = [];
        this.graph = {};
        this.cycles = [];
    }

    public abstract async parseData(): Promise<IData>;
    public abstract buildGraph(): IGraph;
    public abstract detectCycles(): INode[];
    public abstract isValid(): boolean;

    public getData() { return this.data };
    public getGraph() { return this.graph };
}

export class CSVParser extends DataParser {
    constructor(path: fs.PathLike, options?: string | {
        flags?: string;
        encoding?: BufferEncoding;
        fd?: number;
        mode?: number;
        autoClose?: boolean;
        emitClose?: boolean;
        start?: number;
        end?: number;
        highWaterMark?: number;
    }) {
        super(path, options);
    }

    public detectCycles(): INode[] {
        if (this.isTraversed) return this.cycles;

        const drug = this.graph[UCCode.Drug];
        const consumable = this.graph[UCCode.Consumable];

        [drug, consumable].forEach(root => {
            const visited = {};
            const stack = [root];
            while (stack.length > 0) {
                const entity = stack.pop();
    
                if (!visited[entity.code]) {
                    visited[entity.code] = true;
                }
    
                if (entity.children) {
                    for (let i = 0; i < entity.children.length; i++) {
                        const child = entity.children[i];
                        if (!visited[child.code]) {
                            stack.push(child)
                        } else {
                            this.cycles.push(child);
                        }
                    };
                }
            }
        })

        return this.cycles;
    }

    public isValid(): boolean {
        return !!this.detectCycles();
    }

    public async parseData(): Promise<IData> {
        if (this.isParsed) return this.data;

        // Read data stream.
        const stream = await fs.createReadStream(this.path, this.options);
        await new Promise((resolve) => {
            stream
                .pipe(csv())
                .on('data', row => {
                    const entity = Object.entries(row).reduce((acc: IRow, [column, value]: [string, string]) => {
                        const key = column.trim().toLowerCase().replace(/ *\([^)]*\) */g, '').replace(/ /g, '_')
                        return { ...acc, [key]: value };
                    }, {} as IRow);
                    this.data.push(entity);
                })
                .on('end', () => resolve())
        });

        return this.data;
    }

    public buildGraph(): IGraph {
        if (this.isBuilt) return this.graph;

        // Initialise root nodes.
        // TODO: get root category codes from input file.
        const drug = { code: '933f3f00', name: 'Drug', type: 'Category', children: [], properties: [] };
        const consumable = { code: '77fcbb00', name: 'Consumable', type: 'Category', children: [], properties: [] };

        // Initialise adjacency list for storing graph.
        this.graph = {
            [drug.code]: drug,
            [consumable.code]: consumable
        };

        try {
            // Parse entity graph.
            this.data.forEach(row => {
                const {
                    product,
                    //product_synonym,
                    combination,
                    route,
                    dose_form,
                    dose_qualification,
                    strength,
                    //unit_of_presentation,
                    //immediate_packaging,
                    //pack_size,
                    //outer_packaging,
                    uc1,
                    uc2,
                    uc3,
                    uc4,
                    uc5,
                    uc6,
                    //uc7,
                    //uc8, 
                    //uc9
                } = row;

                // If row include strength code...
                if (uc6) {
                    // create strength node.
                    if (!(uc6 in this.graph)) {
                        const code = uc6;
                        const name = strength;
                        const type = 'Strength';

                        const node = {
                            code,
                            name,
                            type,
                            children: [],
                            properties: [],
                        };

                        this.graph[uc6] = node;

                        console.log(`Created strength node: ${JSON.stringify(node)}`);
                    }
                }

                // IF row includes dose qualification code...
                if (uc5) {
                    // create dose qualification node.
                    if (!(uc5 in this.graph)) {
                        const code = uc5;
                        const name = dose_qualification;
                        const type = 'DoseQualifier';

                        const node = {
                            code,
                            name,
                            type,
                            children: [],
                            properties: [],
                        }

                        this.graph[uc5] = node;

                        console.log(`Created dose qualifier node: ${JSON.stringify(node)}`);
                    }
                }

                // If row includes dose form code...
                if (uc4) {
                    // create dose form node.
                    if (!(uc4 in this.graph)) {
                        const code = uc4;
                        const name = dose_form;
                        const type = 'DoseForm';

                        const node = {
                            code,
                            name,
                            type,
                            children: [],
                            properties: [],
                        }

                        this.graph[uc4] = node;

                        console.log(`Created dose form node: ${JSON.stringify(node)}`);
                    }
                }

                // If row includes route code...
                if (uc3) {
                    // create route node.
                    if (!(uc3 in this.graph)) {
                        const code = uc3;
                        const name = route;
                        const type = 'Route';

                        const node = {
                            code,
                            name,
                            type,
                            children: [],
                            properties: [],
                        }

                        this.graph[uc3] = node;

                        console.log(`Created route node: ${JSON.stringify(node)}`);
                    }
                }

                // If row includes product code.
                if (uc2) {
                    // create product node.
                    if (!(uc2 in this.graph)) {
                        const code = uc2;
                        const name = product;
                        const type = 'Product';

                        const node = {
                            code,
                            name,
                            type,
                            combines: [],
                            children: [],
                            properties: [],
                        }

                        this.graph[uc2] = node;

                        console.log(`Created product node: ${JSON.stringify(node)}`);
                    }
                }

                // If dose qualifier code exists... 
                if (uc5) {
                    // and strength code exists...
                    if (uc6) {
                        // link dose qualification to strength.
                        if (!(this.graph[uc5].children.map(child => child.code).includes(uc6))) {
                            this.graph[uc5].children.push({ code: uc6 });
                            console.log(`Linked dose qualifier with code ${uc5} to strength with code ${uc6}`);
                        }
                    }

                }

                // If dose form code exists...
                if (uc4) {
                    // and dose qualifier code exists...
                    if (uc5) {
                        // link dose form to dose qualifier.
                        if (!(this.graph[uc4].children.map(child => child.code).includes(uc5))) {
                            this.graph[uc4].children.push({ code: uc5 });
                            console.log(`Linked dose form with code ${uc4} to dose qualifier with code ${uc5}`);
                        }
                    }
                    // and dose qualifier code does not exist...
                    else {
                        // and strength code exists...
                        if (uc6) {
                            // link dose form to strength.
                            if (!(this.graph[uc4].children.map(child => child.code).includes(uc6))) {
                                this.graph[uc4].children.push({ code: uc6 });
                                console.log(`Linked dose form with code ${uc4} to strength with code ${uc6}`);
                            }
                        }
                    }
                }

                // If route code exists...
                if (uc3) {
                    // and dose form exists...
                    if (uc4) {
                        // link route to dose form.
                        if (!(this.graph[uc3].children.map(child => child.code).includes(uc4))) {
                            this.graph[uc3].children.push({ code: uc4 });
                            console.log(`Linked route with code ${uc3} to route with code ${uc4}`);
                        }
                    }
                }

                // If product code exists...
                if (uc2) {
                    // and route code exists...
                    if (uc3) {
                        // link product to route.
                        if (!(this.graph[uc2].children.map(child => child.code).includes(uc3))) {
                            this.graph[uc2].children.push({ code: uc3 });
                            console.log(`Linked product with code ${uc2} to route with code ${uc3}`);
                        }
                    }
                    // and route code does not exists...
                    else {
                        // and strength code exists...
                        if (uc6) {
                            // link product to strength.
                            if (!(this.graph[uc2].children.map(child => child.code).includes(uc6))) {
                                this.graph[uc2].children.push({ code: uc6 });
                                console.log(`Linked product with code ${uc2} to strength with code ${uc6}`);
                            }
                        }
                    }

                }

                // If category code exists...
                if (uc1) {
                    // and product code exists...
                    if (uc2) {
                        // link category to product.
                        if (!(this.graph[uc1].children.map(child => child.code).includes(uc2))) {
                            this.graph[uc1].children.push({ code: uc2 });
                            console.log(`Linked category with code ${uc1} to product with code ${uc2}`);
                        }
                    }
                }

                // Parse product combinations.
                // TODO: consistent combination formatting.
                const combinations = combination
                    .split(/[,/]/)
                    .filter(uc => !!uc)
                    .map(uc => uc.trim());

                // Link product to combination.
                combinations.forEach(uc => {
                    if (uc2 && uc) {
                        if (!(this.graph[uc2].combines.map(sibling => sibling.code).includes(uc))) {
                            this.graph[uc2].combines.push({ code: uc });
                            console.log(`Linked product with code ${uc2} to product with code ${uc}`);
                        }
                    }
                });

            });

            // Expand graph edges.
            Object.keys(this.graph).forEach(code => {
                this.graph[code].combines = this.graph[code].combines?.map(uc2 => this.graph[uc2.code]);
                this.graph[code].children = this.graph[code].children?.map(uc => this.graph[uc.code]);
                console.log(`Expanded edges for node with code ${code}`);
            })

            this.isBuilt = true;
        } catch (err) {
            this.isBuilt = false;
        } finally { 
            return this.graph;
        }
    }   
}

export default DataParser;