import DgraphClient from './DgraphClient';

import { INode, IGraph } from './Graph';

export class DgraphLoader {
  private readonly dgraph: DgraphClient;

  constructor(dgraph: DgraphClient) {
    this.dgraph = dgraph;
  }

  public async load(graph: IGraph): Promise<boolean> {
    // Extract entity nodes from graph.
    const entities: INode[] = Object.values(graph);

    // Load individual entities.
    for await (const entity of entities) {
      const query = `
        query {
          Entity as var(func: eq(dgraph.type, ${entity.type})) @filter(eq(code, ${entity.code}))
        }
      `;

      const nQuads = `
        uid(Entity) <name> "${entity.name}" .
        uid(Entity) <code> "${entity.code}" .
        uid(Entity) <dgraph.type> "${entity.type}" .
      `;

      if (await this.dgraph.upsert(query, nQuads)) {
        console.log(`INFO: Loaded entity with code ${entity.code}`);
      } else {
        console.log(`WARNING: Failed to load entity with code ${entity.code}`);
      }
    }

    // Link parent entities to children.
    for await (const entity of entities) {
      for await (const child of entity.children) {
        const query = `
          query {
            Entity as var(func: eq(code, ${entity.code}))
            Child as var(func: eq(code, ${child.code}))
          }
        `;

        const nQuads = 'uid(Entity) <children> uid(Child) .';

        if (await this.dgraph.upsert(query, nQuads)) {
          console.log(
            `INFO: Loaded child with code ${child.code} for entity with code ${entity.code}`
          );
        } else {
          console.log(
            `WARNING: Failed to load child with code ${child.code} for entity with code ${entity.code}`
          );
        }
      }
    }

    // Link entities with properties.
    for await (const entity of entities) {
      if (!!entity.properties) {
        for await (const property of entity.properties) {
          const query = `query {
            Entity as var(func: eq(dgraph.type, ${entity.type})) @filter(eq(code, ${entity.code}))
          }`;

          const nQuads = `
            _:property <value> "${property.value}" .
            _:property <dgraph.type> "${property.type}" .

            uid(Entity) <properties> _:property .
          `;

          if (await this.dgraph.upsert(query, nQuads)) {
            console.log(
              `INFO: Loaded property with type ${property.type} for entity with code ${entity.code}`
            );
          } else {
            console.log(
              `WARNING: Failed to load property with type ${property.type} for entity with code ${entity.code}`
            );
          }
        }
      }
    }

    // Link product entities with combinations.
    for await (const entity of entities) {
      if (!!entity.combines) {
        for await (const sibling of entity.combines) {
          const query = `query {
                      Entity as var(func: eq(dgraph.type, ${entity.type})) @filter(eq(code, ${entity.code}))
                      Sibling as var(func: eq(code, ${sibling.code}))
                  }`;

          const nQuads = `uid(Entity) <combines> uid(Sibling) .`;

          if (await this.dgraph.upsert(query, nQuads)) {
            console.log(
              `INFO: Loaded combination with code ${sibling.code} for entity with code ${entity.code}`
            );
          } else {
            console.log(
              `WARNING: Failed to load combination with code ${sibling.code} for entity with code ${entity.code}`
            );
          } 
        }
      }
    }

    return true;
  }
}
