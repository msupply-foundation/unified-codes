import * as fs from 'fs';
import ConsumableDataParser from './ConsumableDataParser';
import DrugDataParser from './DrugDataParser';

import { IEntityGraph, IEntityNode, EEntityType, ParserOptions } from './types';
import VaccineDataParser from './VaccineDataParser';

export class DataParser {
  private readonly ROOT_CODE = 'root';
  private readonly ROOT_NAME = 'Root';

  private graph: IEntityGraph;
  private cycles: IEntityNode[];

  private drugParser: DrugDataParser;
  private consumableParser: ConsumableDataParser;
  private vaccineParser: VaccineDataParser;

  private isParsed: boolean;
  private isBuilt: boolean;
  private isTraversed: boolean;

  constructor(
    paths: {
      drugs: fs.PathLike;
      consumables: fs.PathLike;
      vaccines: fs.PathLike;
    },
    options?: ParserOptions
  ) {
    this.isParsed = false;
    this.isBuilt = false;
    this.isTraversed = false;

    this.drugParser = new DrugDataParser(paths.drugs, options);
    this.consumableParser = new ConsumableDataParser(
      paths.consumables,
      options
    );
    this.vaccineParser = new VaccineDataParser(paths.vaccines, options);

    this.graph = {};
    this.cycles = [];
  }

  public async parseData(): Promise<void> {
    if (this.isParsed) return;

    await this.drugParser.parseData();
    await this.consumableParser.parseData();
    await this.vaccineParser.parseData();

    this.isParsed = true;
  }

  public buildGraph(): IEntityGraph {
    if (this.isBuilt) return this.graph;

    const drugNode = this.drugParser.buildDrugNode(this.graph);
    // const consumableNode = this.consumableParser.buildConsumableNode(
    //   this.graph
    // );
    // const vaccineNode = this.vaccineParser.buildVaccineNode(this.graph);

    this.graph[this.ROOT_CODE] = {
      code: this.ROOT_CODE,
      name: this.ROOT_NAME,
      description: this.ROOT_NAME,
      type: EEntityType.Root,
      // children: [drugNode, consumableNode, vaccineNode],
      children: [drugNode],
      properties: [],
    };

    try {
      // Expand graph edges.
      Object.keys(this.graph).forEach(code => {
        // this.graph[code].combines = this.graph[code].combines?.map((uc2) => this.graph[uc2.code]);
        this.graph[code].children = this.graph[code].children?.map(
          uc => this.graph[uc.code]
        );
        // console.log(`INFO: Expanded edges for node with code ${code}`);
      });

      // Traverse graph and update names.
      const addDescription = (node, description = '') => {
        node.description = `${description} ${node.name}`.trim();
        console.log(
          `INFO: Added descriptions for node with code ${node.code} of ${node.description}`
        );
        node.children?.forEach(child =>
          addDescription(child, node.description)
        );
      };

      // this.graph[this.ROOT_CODE].children?.forEach(category => {
      //   category.children?.forEach(product => addDescription(product));
      // });

      this.isBuilt = true;
    } catch (err) {
      console.error(err);
      this.isBuilt = false;
    } finally {
      // eslint-disable-next-line no-unsafe-finally
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
    return {
      drugs: this.drugParser.getData(),
      consumables: this.consumableParser.getData(),
    };
  }

  public getGraph() {
    return this.graph;
  }
}

export default DataParser;
