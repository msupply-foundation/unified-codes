import * as csv from 'csv-parser';
import * as fs from 'fs';

import { ICSVRow, ICSVData, IEntityGraph, IEntityNode, IPropertyNode, EEntityType, EPropertyType } from './types';

enum UCCode {
  Root = 'root',
  Drug = '933f3f00',
  Consumable = '77fcbb00',
}

enum UCName {
  Root = 'Root',
  Drug = 'Drug',
  Consumable = 'Consumable',
}

const UC_ENTITY: { [name: string]: IEntityNode } = {
  ROOT: {
    code: UCCode.Root,
    name: UCName.Root, 
    type: EEntityType.Root,
    children: [], 
    properties: []
  },
  DRUG: {
    code: UCCode.Drug,
    name: UCName.Drug,
    type: EEntityType.Category,
    children: [], 
    properties: []
  },
  CONSUMABLE: {
    code: UCCode.Consumable,
    name: UCName.Consumable,
    type: EEntityType.Category,
    children: [],
    properties: [],
  }
};

export class DataParser {
  public readonly path: fs.PathLike;
  public readonly options:
    | string
    | {
        flags?: string;
        encoding?: BufferEncoding;
        fd?: number;
        mode?: number;
        autoClose?: boolean;
        emitClose?: boolean;
        start?: number;
        end?: number;
        highWaterMark?: number;
      };

  private data: ICSVData;
  private graph: IEntityGraph;
  private cycles: IEntityNode[];

  private isParsed: boolean;
  private isBuilt: boolean;
  private isTraversed: boolean;

  constructor(
    path: fs.PathLike,
    options?:
      | string
      | {
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
  ) {
    this.path = path;
    this.options = options;

    this.isParsed = false;
    this.isBuilt = false;
    this.isTraversed = false;

    this.data = [];
    this.graph = {};
    this.cycles = [];
  }

  private generateCode(numCharacters = 8) {
    return Math.round(Math.random() * Math.pow(16, numCharacters))
      .toString(16)
      .padStart(numCharacters, '0');
  }

  public async parseData(): Promise<ICSVData> {
    if (this.isParsed) return this.data;

    const parseColumn = column => {
      const REGEX = {
        CR_LF: /[\r\n]/g,
        BRACKETED_DESCRIPTION: / *\([^)]*\) */g,
        SPACE: / /g,
      };

      return column
        .trim()
        .toLowerCase()
        .replace(REGEX.CR_LF, '')
        .replace(REGEX.BRACKETED_DESCRIPTION, '')
        .replace(REGEX.SPACE, '_');
    }

    // Read data stream.
    const stream = await fs.createReadStream(this.path, this.options);
    await new Promise((resolve) => {
      stream
        .pipe(csv())
        .on('data', (row) => {
          const entity = Object.entries<string>(row).reduce(
            (acc: ICSVRow, [column, value]: [string, string]) => {
              const key = parseColumn(column);
              return { ...acc, [key]: value };
            },
            {} as ICSVRow
          );
          this.data.push(entity);
        })
        .on('end', () => resolve(null));
    });

    return this.data;
  }

  public buildGraph(): IEntityGraph {
    if (this.isBuilt) return this.graph;

    // Initialise adjacency list for storing graph.
    this.graph = {
      [UC_ENTITY.ROOT.code]: UC_ENTITY.ROOT,
      [UC_ENTITY.DRUG.code]: UC_ENTITY.DRUG,
      [UC_ENTITY.CONSUMABLE.code]: UC_ENTITY.CONSUMABLE,
    };

    try {
      // Initialise duplicate codes.
      const duplicates = [];

      // Parse entity graph.
      this.data.forEach((row) => {
        const {
          product,
          //product_synonym,
          combination,
          route,
          dose_form,
          dose_qualification,
          strength,
          unit_of_presentation,
          immediate_packaging,
          pack_size,
          //outer_packaging,
          //manufacturer,
          //brand,
          uc1,
          uc2,
          uc3,
          uc4,
          uc5,
          uc6,
          uc7,
          uc8,
          uc9,
          //uc10,
          //uc11,
          //uc12,
          rxnav,
          who_eml_product,
          who_eml_item,
          nzulm,
          nzulm_item,
          unspsc,
        } = row;
      
        const productProperties: IPropertyNode[] = [];
        const itemProperties: IPropertyNode[] = [];

        productProperties.push({ code: this.generateCode(), type: EPropertyType.RxNav, value: rxnav });
        productProperties.push({ code: this.generateCode(), type: EPropertyType.WHOEML, value: who_eml_product });

        itemProperties.push({ code: this.generateCode(), type: EPropertyType.WHOEML, value: who_eml_item });
        productProperties.push({ code: this.generateCode(), type: EPropertyType.NZULM, value: nzulm });
        itemProperties.push({ code: this.generateCode(), type: EPropertyType.NZULM, value: nzulm_item });
        productProperties.push({ code: this.generateCode(), type: EPropertyType.UNSPSC, value: unspsc });

        // If row includes pack size code...
        if (uc9) {
            const code = uc9;
            const name = pack_size;
            const type = EEntityType.PackSize;

            // and node does not exist...
            if (!(uc9 in this.graph)) {
                // create pack size node.
                const node = {
                    code,
                    name,
                    type,
                    children: [],
                    properties: [],
                };

                this.graph[uc9] = node;

                console.log(`INFO: Created node of type ${type}: ${JSON.stringify(node)}`);
            }
        }

        // If row includes immediate packaging code...
        if (uc8) {
            const code = uc8;
            const name = immediate_packaging;
            const type = EEntityType.PackImmediate;

            // and node does not exist...
            if (!(uc8 in this.graph)) {
                // create unit node.
                const node = {
                    code,
                    name,
                    type,
                    children: [],
                    properties: [],
                };

                this.graph[uc8] = node;

                console.log(`INFO: Created node of type ${type}: ${JSON.stringify(node)}`);
            }
        }

        // If row includes unit of presentation code...
        if (uc7) {
            const code = uc7;
            const name = unit_of_presentation;
            const type = EEntityType.Unit;

            // and node does not exist...
            if (!(uc7 in this.graph)) {
                // create unit node.
                const node = {
                    code,
                    name,
                    type,
                    children: [],
                    properties: [],
                };

                this.graph[uc7] = node;

                console.log(`INFO: Created node of type ${type}: ${JSON.stringify(node)}`);
            }
        }

        // If row include strength code...
        if (uc6) {
          const code = uc6;
          const name = strength;
          const type = EEntityType.DoseStrength;

          // and node does not exist...
          if (!(uc6 in this.graph)) {
            // create strength node.
            const node = {
              code,
              name,
              type,
              children: [],
              properties: [],
            };

            this.graph[uc6] = node;

            console.log(`INFO: Created node of type ${type}: ${JSON.stringify(node)}`);
          }
          // and node exists...
          else {
            // check for conflicts.
            if (this.graph[uc6].type != type) {
              duplicates.push(uc6);
            }
          }
        }

        // If row includes dose qualification code...
        if (uc5) {
          const code = uc5;
          const name = dose_qualification;
          const type = EEntityType.FormQualifier;

          // and node does not exist...
          if (!(uc5 in this.graph)) {
            // create dose qualifier node.
            const node = {
              code,
              name,
              type,
              children: [],
              properties: [],
            };

            this.graph[uc5] = node;

            console.log(`INFO: Created dose qualifier node: ${JSON.stringify(node)}`);
          }
          // and node exists...
          else {
            // check for conflicts.
            if (this.graph[uc5].type != type) {
              duplicates.push(uc5);
            }
          }
        }

        // If row includes dose form code...
        if (uc4) {
          const code = uc4;
          const name = dose_form;
          const type = EEntityType.Form;

          // and node does not exist...
          if (!(uc4 in this.graph)) {
            // create dose form node.
            const node = {
              code,
              name,
              type,
              children: [],
              properties: [],
            };

            this.graph[uc4] = node;

            console.log(`INFO: Created dose form node: ${JSON.stringify(node)}`);
          }
          // and node exists...
          else {
            // check for conflicts.
            if (this.graph[uc4].type != type) {
              duplicates.push(uc4);
            }
          }
        }

        // If row includes route code...
        if (uc3) {
          const code = uc3;
          const name = route;
          const type = EEntityType.Route;

          // and node does not exist...
          if (!(uc3 in this.graph)) {
            // create route node.
            const node = {
              code,
              name,
              type,
              children: [],
              properties: [],
            };

            this.graph[uc3] = node;

            console.log(`INFO: Created route node: ${JSON.stringify(node)}`);
          }
          // and node exists...
          else {
            // check for conflicts.
            if (this.graph[uc3].type != type) {
              duplicates.push(uc3);
            }
          }
        }

        // If row includes product code.
        if (uc2) {
          const code = uc2;
          const name = product;
          const type = EEntityType.Product;

          // and node does not exist...
          if (!(uc2 in this.graph)) {
            // create product node.
            const node = {
              code,
              name,
              type,
              combines: [],
              children: [],
              properties: [],
            };

            this.graph[uc2] = node;

            console.log(`INFO: Created product node: ${JSON.stringify(node)}`);
          }
          // and node exists...
          else {
            // check for conflicts.
            if (this.graph[uc2].type != type) {
              duplicates.push(uc2);
            }
          }
        }

        // If pack immediate code exists...
        if (uc8) {
          // and pack size code exists...
          if (uc9) {
            // link pack immediate to pack size.
            if (!this.graph[uc8].children.map((child) => child.code).includes(uc9)) {
              this.graph[uc8].children.push({ code: uc9 });
              console.log(
                `INFO: Linked pack immediate with code ${uc8} to pack size with code ${uc9}`
              );
            }
          }
        }

        // If unit code exists...
        if (uc7) {
          // and pack immediate code exists...
          if (uc8) {
            // link unit to pack immediate.
            if (!this.graph[uc7].children.map((child) => child.code).includes(uc8)) {
              this.graph[uc7].children.push({ code: uc8 });
              console.log(
                `INFO: Linked unit with code ${uc7} to pack immediate with code ${uc8}`
              );
            }
          }
        }

        // If dose strength code exists...
        if (uc6) {
          // and unit code exists...
          if (uc7) {
            // link dose strength to unit.
            if (!this.graph[uc6].children.map((child) => child.code).includes(uc7)) {
              this.graph[uc6].children.push({ code: uc7 });
              console.log(
                `INFO: Linked dose strength with code ${uc6} to unit with code ${uc7}`
              );
            }
          }
        }

        // If dose qualifier code exists...
        if (uc5) {
          // and strength code exists...
          if (uc6) {
            // link dose qualification to strength.
            if (!this.graph[uc5].children.map((child) => child.code).includes(uc6)) {
              this.graph[uc5].children.push({ code: uc6 });
              console.log(
                `INFO: Linked dose qualifier with code ${uc5} to dose strength with code ${uc6}`
              );
            }
          }
        }

        // If dose form code exists...
        if (uc4) {
          // and dose qualifier code exists...
          if (uc5) {
            // link dose form to dose qualifier.
            if (!this.graph[uc4].children.map((child) => child.code).includes(uc5)) {
              this.graph[uc4].children.push({ code: uc5 });
              console.log(
                `INFO: Linked dose form with code ${uc4} to dose qualifier with code ${uc5}`
              );
            }
          }
          // and dose qualifier code does not exist...
          else {
            // and strength code exists...
            if (uc6) {
              // link dose form to strength.
              if (!this.graph[uc4].children.map((child) => child.code).includes(uc6)) {
                this.graph[uc4].children.push({ code: uc6 });
                console.log(`INFO: Linked dose form with code ${uc4} to strength with code ${uc6}`);
              }
            }
          }
        }

        // If route code exists...
        if (uc3) {
          // and dose form exists...
          if (uc4) {
            // link route to dose form.
            if (!this.graph[uc3].children.map((child) => child.code).includes(uc4)) {
              this.graph[uc3].children.push({ code: uc4 });
              console.log(`INFO: Linked route with code ${uc3} to dose form with code ${uc4}`);
            }
          }
        }

        // If product code exists...
        if (uc2) {
          // and route code exists...
          if (uc3) {
            // link product to route.
            if (!this.graph[uc2].children.map((child) => child.code).includes(uc3)) {
              this.graph[uc2].children.push({ code: uc3 });
              console.log(`INFO: Linked product with code ${uc2} to route with code ${uc3}`);
            }
          }
          // and route code does not exists...
          else {
            // and strength code exists...
            if (uc6) {
              // link product to strength.
              if (!this.graph[uc2].children.map((child) => child.code).includes(uc6)) {
                this.graph[uc2].children.push({ code: uc6 });
                console.log(`INFO: Linked product with code ${uc2} to strength with code ${uc6}`);
              }
            }
          }
        }

        // If category code exists...
        if (uc1) {
          // and product code exists...
          if (uc2) {
            // link category to product.
            if (!this.graph[uc1].children.map((child) => child.code).includes(uc2)) {
              this.graph[uc1].children.push({ code: uc2 });
              console.log(`INFO: Linked category with code ${uc1} to product with code ${uc2}`);
            }
          }
        }

        // Parse product combinations.
        // TODO: consistent combination formatting.
        const combinations =
          combination
            ?.split(/[,/]/)
            .filter((uc) => !!uc)
            .map((uc) => uc.trim()) ?? [];

        // disabled for now as this creates a circular reference
        // // Link product to combination.
        // combinations.forEach((uc) => {
        //   if (uc2 && uc) {
        //     if (!this.graph[uc2].combines.map((sibling) => sibling.code).includes(uc)) {
        //       this.graph[uc2].combines.push({ code: uc });
        //       console.log(`INFO: Linked product with code ${uc2} to product with code ${uc}`);
        //     }
        //   }
        // });

        // Process external properties at product (UC2) level
        if (!uc7 && uc2) {
          productProperties.forEach((property) => {
            // temporary restriction for uc7 - these are not currently imported
            if (property.value) {
              console.log(
                `INFO: Property of type ${property.type} with value ${property.value} added for ${uc2}`
              );
              if (!this.graph[uc2].properties.some((p) => p.type === property.type)) {
                this.graph[uc2].properties.push(property);
              }
            }
          });
        }

        // Process external properties at item (UC6) level
        if (!uc7 && uc6) {
          itemProperties.forEach((property) => {
            // temporary restriction for uc7 - these are not currently imported
            if (property.value) {
              console.log(
                `INFO: Property of type ${property.type} with value ${property.value} added for ${uc6}`
              );
              if (!this.graph[uc6].properties.some((p) => p.type === property.type)) {
                this.graph[uc6].properties.push(property);
              }
            }
          });
        }
      });

      // Expand graph edges.
      Object.keys(this.graph).forEach((code) => {
        this.graph[code].combines = this.graph[code].combines?.map((uc2) => this.graph[uc2.code]);
        this.graph[code].children = this.graph[code].children?.map((uc) => this.graph[uc.code]);
        console.log(`INFO: Expanded edges for node with code ${code}`);
      });

      const updateChildNames = node => updateName(node, null);

      // Traverse graph and update names.
      const updateName = (node, name) => {
        if (name) {
          node.name = `${name} ${node.name}`;
          console.log(`INFO: Renamed node with code ${node.code} to ${node.name}`);
        }

        node.children?.forEach(child => updateName(child, node.name));
      };
      
      this.graph[UCCode.Drug].children?.forEach(child => updateChildNames(child));

      // Output warnings for any duplicate entity codes.
      duplicates.forEach((uc) => console.log(`WARNING: Detected duplicate code ${uc}!`));

      this.isBuilt = true;
    } catch (err) {
      console.error(err);
      this.isBuilt = false;
    } finally {
      return this.graph;
    }
  }

  public detectCycles(): IEntityNode[] {
    if (this.isTraversed) return this.cycles;

    const visited = {};
    const stack = [this.graph.root];
    while (stack.length > 0) {
      const entity = stack.pop();

      if (!visited[entity.code]) {
        visited[entity.code] = true;
      }

      if (entity.children) {
        for (let i = 0; i < entity.children.length; i++) {
          const child = entity.children[i];
          if (!visited[child.code]) {
            stack.push(child);
          } else {
            this.cycles.push(child);
          }
        }
      }
    }

    return this.cycles;
  }

  public isValid(): boolean {
    return !!this.detectCycles();
  }

  public getData() {
    return this.data;
  }

  public getGraph() {
    return this.graph;
  }
}

export default DataParser;
