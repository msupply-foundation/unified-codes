import dgraph from 'dgraph-js';

export abstract class DataLoader {
  public readonly host: string;
  public readonly port: string;

  constructor(host: string, port: string) {
    this.host = host;
    this.port = port;
  }

  public abstract load(data: Object): Promise<boolean>;
}

export class JSONLoader extends DataLoader {
  constructor(host: string, port: string) {
    super(host, port);
  }

  public async load(data: Object): Promise<boolean> {
    const dgraphStub = new dgraph.DgraphClientStub(`${this.host}:${this.port}`);
    const dgraphClient = new dgraph.DgraphClient(dgraphStub);

    const entities = Object.values(data);

    // Load entities.
    for await (const entity of entities) {
      const req = new dgraph.Request();
      const query = `query {
                Entity as var(func: eq(dgraph.type, ${entity.type})) @filter(eq(code, ${entity.code}))
            }`;

      const mutation = new dgraph.Mutation();
      mutation.setSetNquads(`
                uid(Entity) <name> "${entity.name}" .
                uid(Entity) <code> "${entity.code}" .
                uid(Entity) <dgraph.type> "${entity.type}" .
            `);

      req.setQuery(query);
      req.setMutationsList([mutation]);
      req.setCommitNow(true);

      const txn = dgraphClient.newTxn();

      try {
        await txn.doRequest(req);
        console.log(`INFO: Loaded entity with code ${entity.code}`);
      } catch {
        console.log(`WARNING: Failed to load entity with code ${entity.code}`);
      } finally {
        txn.discard();
      }
    }

    // Link parents to children.
    for await (const entity of entities) {
      for await (const child of entity.children) {
        const req = new dgraph.Request();
        const query = `query {
                    Entity as var(func: eq(code, ${entity.code}))
                    Child as var(func: eq(code, ${child.code}))
                }`;

        const mutation = new dgraph.Mutation();
        mutation.setSetNquads(`
                    uid(Entity) <children> uid(Child) .
                `);

        req.setQuery(query);
        req.setMutationsList([mutation]);
        req.setCommitNow(true);

        const txn = dgraphClient.newTxn();
        try {
          await txn.doRequest(req);
          console.log(
            `INFO: Loaded child with code ${child.code} for entity with code ${entity.code}`
          );
        } catch {
          console.log(
            `WARNING: Failed to load child with code ${child.code} for entity with code ${entity.code}`
          );
        } finally {
          txn.discard();
        }
      }
    }

    // Link properties to entities.
    for await (const entity of entities.filter((entity) => !!entity.properties)) {
      for await (const property of entity.properties) {
        const req = new dgraph.Request();
        const query = `query {
                      Entity as var(func: eq(dgraph.type, ${entity.type})) @filter(eq(code, ${entity.code}))
                      Property as var(func: eq(dgraph.type, ${property.type}))
                  }`;

        const mutation = new dgraph.Mutation();
        mutation.setSetNquads(`
            uid(Property) <value> "${property.value}" .
            uid(Property) <dgraph.type> "${property.type}" .

            uid(Entity) <properties> uid(Property) .
        `);

        req.setQuery(query);
        req.setMutationsList([mutation]);
        req.setCommitNow(true);

        const txn = dgraphClient.newTxn();
        try {
          await txn.doRequest(req);
          console.log(
            `INFO: Loaded property with type ${property.type} for entity with code ${entity.code}`
          );
        } catch {
          console.log(
            `WARNING: Failed to load property with type ${property.type} for entity with code ${entity.code}`
          );
        } finally {
          txn.discard();
        }
      }
    }

    // Link products to combinations.
    for await (const entity of entities.filter((entity) => !!entity.combines)) {
      for await (const sibling of entity.combines) {
        const req = new dgraph.Request();
        const query = `query {
                    Entity as var(func: eq(dgraph.type, ${entity.type})) @filter(eq(code, ${entity.code}))
                    Sibling as var(func: eq(dgraph.type, ${sibling.type})) @filter(eq(code, ${sibling.code}))
                }`;

        const mutation = new dgraph.Mutation();
        mutation.setSetNquads(`
                    uid(Entity) <combines> uid(Sibling) .
                `);

        req.setQuery(query);
        req.setMutationsList([mutation]);
        req.setCommitNow(true);

        const txn = dgraphClient.newTxn();
        try {
          await txn.doRequest(req);
          console.log(
            `INFO: Loaded combination with code ${sibling.code} for entity with code ${entity.code}`
          );
        } catch (err) {
          console.log(
            `WARNING: Failed to load combination with code ${sibling.code} for entity with code ${entity.code}`
          );
        } finally {
          txn.discard();
        }
      }
    }

    return true;
  }
}
