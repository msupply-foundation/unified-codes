import dgraph from 'dgraph-js';

export abstract class DataLoader {
    public readonly host: string;
    public readonly port: string;

    constructor(host: string, port: string) {
        this.host = host;
        this.port = port;
    }

    public abstract async load(data: Object): Promise<boolean>;
}

export class JSONLoader extends DataLoader {
    constructor(host: string, port: string) {
        super(host, port);
    }

    public async load(data: Object): Promise<boolean> {
        const dgraphStub = new dgraph.DgraphClientStub(`${this.host}:${this.port}`)
        const dgraphClient = new dgraph.DgraphClient(dgraphStub);
        
        const entities = Object.values(data);

        // Load entities.
        entities.forEach(async entity => {
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
            } catch(err) {
                console.log(err);
            } finally {
                txn.discard();
            }
        });

        // Link parents to children.
        entities.forEach(async entity => {
            entity.children.forEach(async child => {
                const req = new dgraph.Request();
                const query = `query {
                    Entity as var(func: eq(dgraph.type, ${entity.type})) @filter(eq(code, ${entity.code}))
                    Child as var(func: eq(dgraph.type, ${child.type})) @filter(eq(code, ${child.code}))
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
                } catch(err) {
                    console.log(err);
                } finally {
                    txn.discard();
                }
            })
        });

        // Link products to combinations.
        entities
            .filter(entity => !!entity.combines)
            .forEach(async entity => {
                entity.combines.forEach(async sibling => {
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
                    } catch(err) {
                        console.log(err);
                    } finally {
                        txn.discard();
                    }
                })
            });

        return true;
    }
}