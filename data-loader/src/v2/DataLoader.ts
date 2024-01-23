import dgraph from 'dgraph-js';

import { IEntityNode, IEntityGraph } from './types';

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

  public async load(schema: string, graph: IEntityGraph): Promise<boolean> {
    // Delete all existing data.
    await this.dgraph.dropAll();

    console.log(`INFO: Dropped existing Dgraph data`);

    // Load schema.
    await this.dgraph.alter(schema);

    console.log(`INFO: Loaded Dgraph schema`);

    // Extract entity nodes from graph.
    const entities: IEntityNode[] = Object.values(graph);

    console.log(`INFO: Extracted entity nodes`);

    const routes = new Set();
    const forms = new Set();
    const formQualifiers = new Set();
    const immediatePackagings = new Set();

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
        uid(Entity) <alternativeNames> "${entity.alternativeNames}" .
        uid(Entity) <dgraph.type> "Entity" .
      `;

      if (await this.dgraph.upsert(query, nQuads)) {
        console.log(`INFO: Loaded entity with code ${entity.code}`);
      } else {
        console.log(`WARNING: Failed to load entity with code ${entity.code}`);
      }
      if (entity.type === 'Route') routes.add(entity.name.trim());
      if (entity.type === 'Form') forms.add(entity.name.trim());
      if (
        entity.type === 'FormQualifier' &&
        entity.name &&
        entity.name.trim() &&
        entity.name.trim().length < 20
      ) {
        formQualifiers.add(entity.name.trim());
      }
      if (entity.type === 'PackImmediate')
        immediatePackagings.add(entity.name.trim());
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
    for await (const route of routes) {
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
    for await (const form of forms) {
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

      // Look to see if the form and qualifier combination exists in a entity description...
      // If so we need to create a form with the qualifier attached

      for await (const formQualifier of formQualifiers) {
        if (!formQualifier) continue;
        for await (const entity of entities) {
          if (
            entity.description &&
            entity.description.includes(`${form} ${formQualifier}`)
          ) {
            const nQuads = `
              _:form <name> "${form} (${formQualifier})" .
              _:form <code> "${form} (${formQualifier})" .
              _:form <type> "Form" .
              _:form <dgraph.type> "ConfigurationItem" .
            `;

            if (await this.dgraph.mutate(nQuads)) {
              console.log(
                `INFO: Loaded form qualifier with name ${formQualifier}`
              );
            } else {
              console.log(
                `WARNING: Failed to load form qualifier with name ${formQualifier}`
              );
            }
            break;
          }
        }
      }
    }

    // Create immediate packagings.
    for await (const immediatePackaging of immediatePackagings) {
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
