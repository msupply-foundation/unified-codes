import dgraph from 'dgraph-js';

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

  async mutate(nQuads: string, commitNow: boolean = true) {
    const mutation: dgraph.Mutation = new dgraph.Mutation;
    mutation.setSetNquads(nQuads);

    const request: dgraph.Request = new dgraph.Request();
    request.setCommitNow(commitNow);
    request.setMutationsList([mutation]);

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

  async upsert(query: string, nQuads: string, commitNow: boolean = true) {
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

export default DgraphClient;