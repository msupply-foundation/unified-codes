import * as fs from 'fs';
import { parseCsv } from './parseCsv';

import {
  IEntityGraph,
  IEntityNode,
  EEntityType,
  ParserOptions,
  IConsumablesCSVData,
} from './types';

export class ConsumableDataParser {
  private readonly CONSUMABLE_CODE = '77fcbb00';
  private readonly CONSUMABLE_NAME = 'Consumable';

  public readonly path: fs.PathLike;
  public readonly options?: ParserOptions;

  private data: IConsumablesCSVData;

  private isParsed: boolean;
  private isBuilt: boolean;

  constructor(path: fs.PathLike, options?: ParserOptions) {
    this.path = path;
    this.options = options;

    this.isParsed = false;
    this.isBuilt = false;

    this.data = [];
  }

  public async parseData(): Promise<IConsumablesCSVData> {
    if (this.isParsed) return this.data;

    this.data = await parseCsv(this.path, this.options);

    this.isParsed = true;
    return this.data;
  }

  public buildConsumableNode(graph: IEntityGraph): IEntityNode {
    if (this.isBuilt) return graph[this.CONSUMABLE_CODE];

    // Initialise adjacency list for storing graph.
    graph[this.CONSUMABLE_CODE] = {
      code: this.CONSUMABLE_CODE,
      name: this.CONSUMABLE_NAME,
      description: this.CONSUMABLE_NAME,
      type: EEntityType.Category,
      children: [],
      properties: [],
    };

    try {
      // Initialise duplicate codes.
      const duplicates: string[] = [];

      // Parse entity graph.
      this.data.forEach(row => {
        const productDefinition = [
          { name: row.device_name, code: row.uc1, type: EEntityType.Product },
          {
            name: row.presentation,
            code: row.uc2,
            type: EEntityType.Presentation,
          },
          {
            name: row.extra_description,
            code: row.uc3,
            type: EEntityType.ExtraDescription,
          },
        ];

        // TODO: properties
        // const productProperties: IPropertyNode[] = [
        //   { type: EPropertyType.RxNav, value: row.rxnav },
        //   { type: EPropertyType.WHOEML, value: row.who_eml_product },
        //   { type: EPropertyType.NZULM, value: row.nzulm },
        //   { type: EPropertyType.UNSPSC, value: row.unspsc },
        // ];

        // const itemProperties: IPropertyNode[] = [
        //   { type: EPropertyType.WHOEML, value: row.who_eml_item },
        //   { type: EPropertyType.NZULM, value: row.nzulm_item },
        // ];

        productDefinition.forEach(item => {
          if (!item.code) return;

          if (item.code in graph) {
            // check for conflicts.
            if (item.type && graph[item.code].type != item.type) {
              duplicates.push(item.code);
            }
          } else {
            const node = {
              code: item.code,
              name: item.name,
              type: item.type,
              category: this.CONSUMABLE_NAME,
              combines: [],
              children: [],
              properties: [],
            };
            graph[item.code] = node;

            console.log(
              `INFO: Created ${item.type} node: ${JSON.stringify(node)}`
            );
          }
        });

        const productCode = productDefinition.find(
          item => item.type === EEntityType.Product
        )?.code;

        // If product code exists
        if (productCode) {
          // link product to consumable category:
          if (
            !graph[this.CONSUMABLE_CODE].children
              .map(child => child.code)
              .includes(productCode)
          ) {
            graph[this.CONSUMABLE_CODE].children.push({ code: productCode });
            console.log(
              `INFO: Linked product with code ${productCode} to consumable category (${this.CONSUMABLE_CODE})`
            );
          }
        }

        // Iterate through and assign children to parents
        // This starts at the top of the graph and for each node, finds the closest lower level node that has a code and name
        // This avoids having to manually define each combination of 'levels' that are able to be connected
        let parentIndex = 0;
        let childIndex = 1;
        while (childIndex < productDefinition.length) {
          const parent = productDefinition[parentIndex];
          const child = productDefinition[childIndex];
          if (child.name && child.code) {
            if (
              !graph[parent.code].children
                .map(existingGraphChild => existingGraphChild.code)
                .includes(child.code)
            ) {
              graph[parent.code].children.push(child);
              console.log(
                `INFO: Linked ${parent.type} with code ${parent.code} to ${child.type} with code ${child.code}`
              );
            }
            parentIndex = childIndex;
          }
          childIndex++;
        }
      });

      // Output warnings for any duplicate entity codes.
      duplicates.forEach(uc =>
        console.log(`WARNING: Detected duplicate code ${uc}!`)
      );

      this.isBuilt = true;
    } catch (err) {
      console.error(err);
      this.isBuilt = false;
    }
    return graph[this.CONSUMABLE_CODE];
  }

  public getData() {
    return this.data;
  }
}

export default ConsumableDataParser;
