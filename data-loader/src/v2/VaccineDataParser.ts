import * as fs from 'fs';
import { parseCsv } from './parseCsv';

import {
  IEntityGraph,
  IEntityNode,
  EEntityType,
  ParserOptions,
  IVaccinesData,
  EPropertyType,
  IPropertyNode,
} from './types';

export class VaccineDataParser {
  private readonly VACCINE_CODE = '5048e0ad';
  private readonly VACCINE_NAME = 'Vaccine';

  public readonly path: fs.PathLike;
  public readonly options?: ParserOptions;

  private data: IVaccinesData;

  private isParsed: boolean;
  private isBuilt: boolean;

  constructor(path: fs.PathLike, options?: ParserOptions) {
    this.path = path;
    this.options = options;

    this.isParsed = false;
    this.isBuilt = false;

    this.data = [];
  }

  public async parseData(): Promise<IVaccinesData> {
    if (this.isParsed) return this.data;

    this.data = await parseCsv(this.path, this.options);

    this.isParsed = true;
    return this.data;
  }

  public buildVaccineNode(graph: IEntityGraph): IEntityNode {
    if (this.isBuilt) return graph[this.VACCINE_CODE];

    // Initialise adjacency list for storing graph.
    graph[this.VACCINE_CODE] = {
      code: this.VACCINE_CODE,
      name: this.VACCINE_NAME,
      description: this.VACCINE_NAME,
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
          { name: row.drug_name, code: row.uc1, type: EEntityType.Product },
          { name: row.route, code: row.uc2, type: EEntityType.Route },
          { name: row.dose_form, code: row.uc3, type: EEntityType.Form },
          {
            name: row.drug_name_details,
            code: row.uc4,
            type: EEntityType.VaccineNameDetails,
          },
          {
            name: row.active_ingredients,
            code: row.uc5,
            type: EEntityType.ActiveIngredients,
          },
          { name: row.brand, code: row.uc6, type: EEntityType.Brand },
          {
            name: row.strength,
            code: row.uc7,
            type: EEntityType.DoseStrength,
          },
          {
            name: row.unit_of_presentation,
            code: row.uc8,
            type: EEntityType.Unit,
          },
          {
            name: row.immediate_packaging,
            code: row.uc9,
            type: EEntityType.PackImmediate,
          },
          {
            name: row.pack_size,
            code: row.uc10,
            type: EEntityType.PackSize,
          },
        ];

        const productProperties: IPropertyNode[] = [
          { type: EPropertyType.RxNav, value: row.rxnav },
          { type: EPropertyType.WHOEML, value: row.who_eml_product },
          { type: EPropertyType.NZULM, value: row.nzulm },
          { type: EPropertyType.UNSPSC, value: row.unspsc },
        ];

        const itemProperties: IPropertyNode[] = [
          { type: EPropertyType.WHOEML, value: row.who_eml_item },
          { type: EPropertyType.NZULMItem, value: row.nzulm_item },
        ];

        productDefinition.forEach(item => {
          if (!item.code) return;

          const regex = /^[A-Za-z0-9]+$/;
          if (!regex.test(item.code)) {
            console.log(
              `WARNING: Code ${item.code} contains non-alphanumeric characters! Skipping...`
            );
            return;
          }

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
              category: this.VACCINE_NAME,
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
          // link product to vaccine category:
          if (
            !graph[this.VACCINE_CODE].children
              .map(child => child.code)
              .includes(productCode)
          ) {
            graph[this.VACCINE_CODE].children.push({ code: productCode });
            console.log(
              `INFO: Linked product with code ${productCode} to vaccine category (${this.VACCINE_CODE})`
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

        // Process external properties at product level
        if (productCode) {
          productProperties.forEach(property => {
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
        )?.code;

        // Process external properties at unit of use/strength level
        if (strengthCode) {
          itemProperties.forEach(property => {
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

        // Parse product alternative names
        if (productCode) {
          const altNames = row.product_synonym
            .split(',')
            .map(name => name.trim())
            .filter(name => !!name);

          if (altNames.length) {
            // store as a string so they're searchable...
            const serialisedAltNames = altNames.join(',');

            graph[productCode].alternativeNames = serialisedAltNames;

            console.log(
              `INFO: Alternate names ${serialisedAltNames} added for ${productCode}`
            );
          }
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
    return graph[this.VACCINE_CODE];
  }

  public getData() {
    return this.data;
  }
}

export default VaccineDataParser;
