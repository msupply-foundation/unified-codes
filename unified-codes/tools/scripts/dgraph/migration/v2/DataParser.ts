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

type ITree = { [code: string]: INode };

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
    protected tree: ITree;

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
        this.data = [];
        this.tree = {};
    }

    public abstract async parseData(): Promise<boolean>;
    public abstract buildTree(): boolean;
    public abstract validateTree(): boolean;

    public getData() { return this.data };
    public getTree() { return this.tree };
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

    public validateTree(): boolean {
        const roots = [this.tree[UCCode.Drug], this.tree[UCCode.Consumable]];

        let hasCycle = false;
        roots.forEach(root => {
            const visited = {};
            const stack = [root];
    
            while (stack.length > 0 && !hasCycle) {
                const entity = stack.pop();
    
                if (!visited[entity.code]) {
                    visited[entity.code] = true;
                }
    
                if (entity.children) {
                    for (let i = 0; i < entity.children.length && !hasCycle; i++) {
                        const child = entity.children[i];
                        if (!visited[child.code]) {
                            stack.push(child)
                        } else {
                            hasCycle = true;
                        }
                    };
                }
            }
        })

        return !hasCycle;

    }

    public async parseData(): Promise<boolean> {
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

        return !!this.data;
    }

    public buildTree(): boolean {
        // Initialise root nodes.
        // TODO: get root category codes from input file.
        const drug = { code: '933f3f00', name: 'Drug', type: 'Category', children: [], properties: [] };
        const consumable = { code: '77fcbb00', name: 'Consumable', type: 'Category', children: [], properties: [] };

        // Initialise adjacency list for storing graph.
        this.tree = {
            [drug.code]: drug,
            [consumable.code]: consumable
        };

        // Parse entity tree.
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

            // Each row defines an item at uc6.
            if (uc6) { 
                if (!(uc6 in this.tree)) {
                    this.tree[uc6] = {
                        code: uc6,
                        name: strength,
                        type: 'Strength',
                        children: [],
                        properties: [],
                    };
                }
            }

            // If does not exist, create dose qualification node.
            if (uc5) {
                if (!(uc5 in this.tree)) {
                    this.tree[uc5] = {
                        code: uc5,
                        name: dose_qualification,
                        type: 'DoseQualifier',
                        children: [],
                        properties: [],
                    }
                }
            }
 

            // If not linked, link parent dose qualification node to child.
            if (uc5 && uc6) {
                if (!(this.tree[uc5].children.map(child => child.code).includes(uc6))) {
                    this.tree[uc5].children.push({ code: uc6 });
                }
            }

            // If does not exist, create dose form node.
            if (uc4) {
                if (!(uc4 in this.tree)) {
                    this.tree[uc4] = {
                        code: uc4,
                        name: dose_form,
                        type: 'DoseForm',
                        children: [],
                        properties: [],
                    }
                }
            }

            // If not linked, link parent dose form node to child.
            if (uc4 && uc5) {
                if (!(this.tree[uc4].children.map(child => child.code).includes(uc5))) {
                    this.tree[uc4].children.push({ code: uc5 });
                }
            }

            // If does not exist, create route node.
            if (uc3) {
                if (!(uc3 in this.tree)) {
                    this.tree[uc3] = {
                        code: uc3,
                        name: route,
                        type: 'Route',
                        children: [],
                        properties: [],
                    }
                }
            }

            // If not linked, link parent route node to child.
            if (uc3 && uc4) {
                if (!(this.tree[uc3].children.map(child => child.code).includes(uc4))) {
                    this.tree[uc3].children.push({ code: uc4 });
                }
            }

            // If does not exist, create product node.
            if (uc2) {
                if (!(uc2 in this.tree)) {
                    this.tree[uc2] = {
                        code: uc2,
                        name: product,
                        type: 'Product',
                        combines: [],
                        children: [],
                        properties: [],
                    }
                }
            }

            // Parse product combinations.
            // TODO: consistent combination formatting.
            const combinations = combination
                .split(/[,/]/)
                .filter(uc => !!uc)
                .map(uc => uc.trim());
            
            // If not linked, link product node to combination code.
            combinations.forEach(uc => {
                 if (uc2 && uc) {
                    if (!(this.tree[uc2].combines.map(sibling => sibling.code).includes(uc))) {
                        this.tree[uc2].combines.push({ code: uc });
                    }
                }
            });

            // If not linked, link parent product node to child.
            if (uc2 && uc3) {
                if (!(this.tree[uc2].children.map(child => child.code).includes(uc3))) {
                    this.tree[uc2].children.push({ code: uc3 });
                }
            }

            // IF not linked, link parent category to child.
            if (uc1 && uc2) {
                if (!(this.tree[uc1].children.map(child => child.code).includes(uc2))) {
                    this.tree[uc1].children.push({ code: uc2 });
                }
            }
        });

        // Expand tree edges.
        Object.keys(this.tree).forEach(key => {
            this.tree[key].combines = this.tree[key].combines?.map(uc2 => this.tree[uc2.code]);
            this.tree[key].children = this.tree[key].children?.map(uc => this.tree[uc.code]);
        })

        return true;
    }
}

export default DataParser;