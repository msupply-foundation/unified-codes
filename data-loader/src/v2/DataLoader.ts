import dgraph from 'dgraph-js';

import {
  IEntityNode,
  IEntityGraph,
  PropertyConfigItem,
  ConfigItems,
} from './types';

export class DgraphClient {
  public readonly host: string;
  public readonly port: string;

  private readonly stub: dgraph.DgraphClientStub;
  private readonly client: dgraph.DgraphClient;

  constructor(host: string, port: string) {
    this.host = host;
    this.port = port;

    this.stub = new dgraph.DgraphClientStub(`${this.host}:${this.port}`);
    this.client = new dgraph.DgraphClient(this.stub);
  }

  async alter(schema: string) {
    const operation: dgraph.Operation = new dgraph.Operation();
    operation.setSchema(schema);
    await this.client.alter(operation);
  }

  async dropAll() {
    const operation: dgraph.Operation = new dgraph.Operation();
    operation.setDropAll(true);
    await this.client.alter(operation);
  }

  async mutate(nQuads: string, commitNow = true) {
    const mutation: dgraph.Mutation = new dgraph.Mutation();
    mutation.setSetNquads(nQuads);

    const request: dgraph.Request = new dgraph.Request();
    request.setCommitNow(commitNow);
    request.setMutationsList([mutation]);

    const txn: dgraph.Txn = this.client.newTxn();

    try {
      await txn.doRequest(request);
      txn.discard();
      return true;
    } catch (e) {
      console.log(e);
      txn.discard();
      return false;
    }
  }

  async upsert(query: string, nQuads: string, commitNow = true) {
    const mutation = new dgraph.Mutation();
    mutation.setSetNquads(nQuads);

    const request = new dgraph.Request();
    request.setCommitNow(commitNow);
    request.setMutationsList([mutation]);

    request.setQuery(query);

    const txn: dgraph.Txn = this.client.newTxn();

    try {
      await txn.doRequest(request);
      txn.discard();
      return true;
    } catch {
      txn.discard();
      return false;
    }
  }
}

export class DataLoader {
  private readonly dgraph: DgraphClient;

  constructor(host: string, port: string) {
    this.dgraph = new DgraphClient(host, port);
  }

  public async load(
    schema: string,
    graph: IEntityGraph,
    configItems: ConfigItems,
    propertyConfigItems: PropertyConfigItem[]
  ): Promise<boolean> {
    // Delete all existing data.
    await this.dgraph.dropAll();

    console.log(`INFO: Dropped existing Dgraph data`);

    // Load schema.
    await this.dgraph.alter(schema);

    console.log(`INFO: Loaded Dgraph schema`);

    // Extract entity nodes from graph.
    const entities: IEntityNode[] = Object.values(graph);

    console.log(`INFO: Extracted entity nodes`);

    // Load individual entities.
    for await (const entity of entities) {
      const query = `
        query {
          Entity as var(func: eq(dgraph.type, "Entity")) @filter(eq(code, ${entity.code}))
        }
      `;

      const nQuads = `
        uid(Entity) <name> "${entity.name}" .
        uid(Entity) <description> "${entity.description}" .
        uid(Entity) <category> "${entity.category}" .
        uid(Entity) <type> "${entity.type}" .
        uid(Entity) <code> "${entity.code}" .
        uid(Entity) <dgraph.type> "Entity" .
        ${
          entity.alternativeNames
            ? `uid(Entity) <alternative_names> "${entity.alternativeNames}" .`
            : ''
        }`;

      if (await this.dgraph.upsert(query, nQuads)) {
        console.log(`INFO: Loaded entity with code ${entity.code}`);
      } else {
        console.log(`WARNING: Failed to load entity with code ${entity.code}`);
      }
    }

    // Link parent entities to children.
    for await (const entity of entities) {
      for await (const child of entity.children ?? []) {
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
      if (entity.properties) {
        for await (const property of entity.properties) {
          const query = `query {
            Entity as var(func: eq(dgraph.type, "Entity")) @filter(eq(code, ${entity.code}))
          }`;

          const nQuads = `
            _:property <code> "${entity.code}_${property.type}" .
            _:property <value> "${property.value}" .
            _:property <type> "${property.type}" .
            _:property <dgraph.type> "Property" .
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

    // Create routes.
    for await (const route of configItems.routes) {
      if (!route) continue;
      const nQuads = `
        _:route <name> "${route}" .
        _:route <code> "${route}" .
        _:route <type> "Route" .
        _:route <dgraph.type> "ConfigurationItem" .
      `;

      if (await this.dgraph.mutate(nQuads)) {
        console.log(`INFO: Loaded route with name ${route}`);
      } else {
        console.log(`WARNING: Failed to load route with name ${route}`);
      }
    }

    // Create forms.
    for await (const form of configItems.forms) {
      if (!form) continue;
      const nQuads = `
        _:form <name> "${form}" .
        _:form <code> "${form}" .
        _:form <type> "Form" .
        _:form <dgraph.type> "ConfigurationItem" .
      `;

      if (await this.dgraph.mutate(nQuads)) {
        console.log(`INFO: Loaded form with name ${form}`);
      } else {
        console.log(`WARNING: Failed to load form with name ${form}`);
      }
    }

    // Create immediate packagings.
    for await (const immediatePackaging of configItems.immediatePackaging) {
      if (!immediatePackaging) continue;
      const nQuads = `
        _:pack <name> "${immediatePackaging}" .
        _:pack <code> "${immediatePackaging}" .
        _:pack <type> "ImmediatePackaging" .
        _:pack <dgraph.type> "ConfigurationItem" .
      `;

      if (await this.dgraph.mutate(nQuads)) {
        console.log(
          `INFO: Loaded immediate packaging with name ${immediatePackaging}`
        );
      } else {
        console.log(
          `WARNING: Failed to load immediate packaging with name ${immediatePackaging}`
        );
      }
    }

    // Create property config items
    for await (const propertyConfigItem of propertyConfigItems) {
      if (!propertyConfigItem) continue;
      const nQuads = `
        _:pack <label> "${propertyConfigItem.label}" .
        _:pack <url> "${propertyConfigItem.url}" .
        _:pack <propertyType> "${propertyConfigItem.type}" .
        _:pack <dgraph.type> "PropertyConfigurationItem" .
      `;

      if (await this.dgraph.mutate(nQuads)) {
        console.log(
          `INFO: Loaded property config item with label ${propertyConfigItem.label}`
        );
      } else {
        console.log(
          `WARNING: Failed to load property config item with label ${propertyConfigItem.label}`
        );
      }
    }

    // Link product entities with combinations.
    for await (const entity of entities) {
      if (entity.combines) {
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
