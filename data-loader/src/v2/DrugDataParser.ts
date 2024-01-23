import * as fs from 'fs';
import { parseCsv } from './parseCsv';

import {
  IDrugCSVData,
  IEntityGraph,
  IEntityNode,
  IPropertyNode,
  EEntityType,
  EPropertyType,
  ParserOptions,
} from './types';

export class DrugDataParser {
  private readonly DRUG_CODE = '933f3f00';
  private readonly DRUG_NAME = 'Drug';

  public readonly path: fs.PathLike;
  public readonly options?: ParserOptions;

  private data: IDrugCSVData;

  private isParsed: boolean;
  private isBuilt: boolean;

  constructor(path: fs.PathLike, options?: ParserOptions) {
    this.path = path;
    this.options = options;

    this.isParsed = false;
    this.isBuilt = false;

    this.data = [];
  }

  public async parseData(): Promise<IDrugCSVData> {
    if (this.isParsed) return this.data;

    this.data = await parseCsv(this.path, this.options);

    this.isParsed = true;
    return this.data;
  }

  public buildDrugNode(graph: IEntityGraph): IEntityNode {
    if (this.isBuilt) return graph[this.DRUG_CODE];

    // Initialise adjacency list for storing graph.
    graph[this.DRUG_CODE] = {
      code: this.DRUG_CODE,
      name: this.DRUG_NAME,
      description: this.DRUG_NAME,
      type: EEntityType.Category,
      children: [],
      properties: [],
    };

    try {
      // Initialise duplicate codes.
      const duplicates: string[] = [];

      // Parse entity graph.
      this.data
        .filter(row => row.uc1 === this.DRUG_CODE)
        .forEach(row => {
          const productDefinition = [
            { name: row.product, code: row.uc2, type: EEntityType.Product },
            { name: row.route, code: row.uc3, type: EEntityType.Route },
            { name: row.dose_form, code: row.uc4, type: EEntityType.Form },
            {
              name: row.dose_qualification,
              code: row.uc5,
              type: EEntityType.FormQualifier,
            },
            {
              name: row.strength,
              code: row.uc6,
              type: EEntityType.DoseStrength,
            },
            {
              name: row.unit_of_presentation,
              code: row.uc7,
              type: EEntityType.Unit,
            },
            {
              name: row.immediate_packaging,
              code: row.uc8,
              type: EEntityType.PackImmediate,
            },
            { name: row.pack_size, code: row.uc9, type: EEntityType.PackSize },
          ];

          const productProperties: IPropertyNode[] = [
            { type: EPropertyType.RxNav, value: row.rxnav },
            { type: EPropertyType.WHOEML, value: row.who_eml_product },
            { type: EPropertyType.NZULM, value: row.nzulm },
            { type: EPropertyType.UNSPSC, value: row.unspsc },
          ];

          const itemProperties: IPropertyNode[] = [
            { type: EPropertyType.WHOEML, value: row.who_eml_item },
            { type: EPropertyType.NZULM, value: row.nzulm_item },
          ];

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
                category: this.DRUG_NAME,
                combines: [],
                children: [],
                properties: [],
                alternativeNames: [],
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
            // link product to drug category:
            if (
              !graph[this.DRUG_CODE].children
                .map(child => child.code)
                .includes(productCode)
            ) {
              graph[this.DRUG_CODE].children.push({ code: productCode });
              console.log(
                `INFO: Linked product with code ${productCode} to drug category (${this.DRUG_CODE})`
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

          // Parse product combinations.
          // TODO: consistent combination formatting.
          // const combinations =
          //   row.combination
          //     ?.split(/[,/]/)
          //     .filter((uc) => !!uc)
          //     .map((uc) => uc.trim()) ?? [];

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

          // Parse product alternative names
          const altNames = row.product_synonym
            .split(',')
            .map(name => name.trim())
            .filter(name => !!name);

          if (productCode) {
            altNames.forEach(name => {
              if (!graph[productCode].alternativeNames.some(n => n === name)) {
                graph[productCode].alternativeNames.push(name);

                console.log(
                  `INFO: Alternate name ${name} added for ${productCode}`
                );
              }
            });
          }

          // Process external properties at product (UC2) level
          if (productCode) {
            productProperties.forEach(property => {
              // temporary restriction for uc7 - these are not currently imported
              if (property.value) {
                console.log(
                  `INFO: Property of type ${property.type} with value ${property.value} added for ${productCode}`
                );
                if (
                  !graph[productCode].properties.some(
                    p => p.type === property.type
                  )
                ) {
                  graph[productCode].properties.push(property);
                }
              }
            });
          }

          const strengthCode = productDefinition.find(
            item => item.type === EEntityType.DoseStrength
          )?.code; // UC6
          const unitCode = productDefinition.find(
            item => item.type === EEntityType.Unit
          )?.code; // UC7

          // Process external properties at item (UC6) level
          if (!unitCode && strengthCode) {
            itemProperties.forEach(property => {
              // temporary restriction for uc7 - these are not currently imported
              if (property.value) {
                console.log(
                  `INFO: Property of type ${property.type} with value ${property.value} added for ${strengthCode}`
                );
                if (
                  !graph[strengthCode].properties.some(
                    p => p.type === property.type
                  )
                ) {
                  graph[strengthCode].properties.push(property);
                }
              }
            });
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
    return graph[this.DRUG_CODE];
  }

  public getData() {
    return this.data;
  }
}

export default DrugDataParser;
