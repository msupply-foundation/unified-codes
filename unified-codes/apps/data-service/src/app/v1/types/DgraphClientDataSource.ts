import { IProperty } from '@unified-codes/data/v1';
import { DataSource } from 'apollo-datasource';
import dgraph, { grpc } from 'dgraph-js';

export class DgraphClientDataSource extends DataSource {
  private dgraph: DgraphClient;

  constructor() {
    super();
    this.dgraph = new DgraphClient('localhost', '9080');
  }
  // ----- UPDATE ENTITY
  // dg.updateEntityGRPCNQuads('c7750233', {
  //   name: 'Abacavir',
  // });
  async updateEntityGRPCNQuads(code: string, patch: { [key: string]: any }) {
    const query = `
      query {
        Entity as var(func: eq(code, "${code}"))
      }
  `;

    // only run the mutation if the Entity exists!
    const condition = '@if(eq(len(Entity), 1))';

    const nQuadRows = [];
    for (const key in patch) {
      nQuadRows.push(`uid(Entity) <${key}> "${patch[key]}" .`);
    }
    const nQuads = nQuadRows.join('\n');

    await this.dgraph.upsert(query, nQuads, condition);

    // OR, AS JSON (simpler)
    // -
    // const json = {
    //   ...patch,
    //   uid: 'uid(Entity)',
    // };

    // await this.dgraph.upsertJson(query, json, condition);
  }

  // ------ ADD PROPERTY
  // dg.addPropertyToEntityGRPCNQuads('abc12345', {
  //   value: 'New Property!',
  //   type: 'code_rxnav',
  // });
  // Not idempotent... maybe antoher query first?
  async addPropertyToEntityGRPCNQuads(drugCode: string, property: IProperty) {
    const query = `
      query {
        Entity as var(func: eq(code, "${drugCode}"))
      }
  `;

    const nQuads = `
  _:property <value> "${property.value}" .
  _:property <dgraph.type> "${property.type}" .

  uid(Entity) <properties> _:property .
`;

    const condition = '@if(eq(len(Entity), 1))';
    await this.dgraph.upsert(query, nQuads, condition);

    // NOT SURE HOW TO DO THE JSON VERSION OF THIS YET... this is making `properties` null lol
    // const json = {
    //   uid: 'uid(Entity)',
    //   properties: {
    //     ...property,
    //     uid: '_:property',
    //   },
    // };
  }

  // ------ ADD PROPERTY
  // dg.addEntityGRPCNQuads('abc12346', {
  //   name: 'Shiny new route',
  //   code: 'abc12356',
  //   type: 'Route',
  // });

  // wouldn't work to add a category but that would be rare/never
  // this is idempotent... somehow
  async addEntityGRPCNQuads(
    parentCode: string,
    entity: {
      name: string;
      code: string;
      type: string;
    }
  ) {
    const query = `
      query {
        Parent as var(func: eq(code, "${parentCode}"))
        Entity as var(func: eq(code, "${entity.code}"))
      }
  `;

    // maybe would want to be able to add an optional combines here, if we have already entered the product it would combine with..
    const nQuads = `
      uid(Entity) <name> "${entity.name}" .
      uid(Entity) <code> "${entity.code}" .
      uid(Entity) <dgraph.type> "${entity.type}" .

      uid(Parent) <children> uid(Entity) .
    `;

    await this.dgraph.upsert(query, nQuads);
  }

  // TODO: not working yet... it might be deleting the node but not the linkings?
  // async deleteEntityGRPCNQuads(code: string) {
  //   const query = `
  //       query {
  //         Entity as var(func: eq(code, "${code}"))
  //       }
  //   `;

  //   const nQuads = `uid(Entity) * * .`;

  //   await this.dgraph.delete(query, nQuads);
  // }
}

class DgraphClient {
  public readonly host: string;
  public readonly port: string;

  private readonly stub: dgraph.DgraphClientStub;
  private readonly client: dgraph.DgraphClient;

  constructor(host: string, port: string) {
    this.host = host;
    this.port = port;

    this.stub = new dgraph.DgraphClientStub(
      `${this.host}:${this.port}`,
      grpc.credentials.createInsecure()
    );
    this.client = new dgraph.DgraphClient(this.stub);
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
    } catch {
      txn.discard();
      return false;
    }
  }

  async upsert(query: string, nQuads: string, condition = '', commitNow = true) {
    const mutation = new dgraph.Mutation();
    mutation.setSetNquads(nQuads);
    mutation.setCond(condition);

    const request = new dgraph.Request();
    request.setCommitNow(commitNow);
    request.setMutationsList([mutation]);

    request.setQuery(query);

    const txn: dgraph.Txn = this.client.newTxn();

    try {
      await txn.doRequest(request);
      txn.discard();
      return true;
    } catch (e) {
      txn.discard();
      return false;
    }
  }

  async upsertJson(query, json: any, condition = '', commitNow = true) {
    const mutation = new dgraph.Mutation();
    mutation.setSetJson(json);
    mutation.setCond(condition);

    const request = new dgraph.Request();
    request.setCommitNow(commitNow);
    request.setMutationsList([mutation]);

    request.setQuery(query);

    const txn: dgraph.Txn = this.client.newTxn();

    try {
      await txn.doRequest(request);
      txn.discard();
      return true;
    } catch (e) {
      txn.discard();
      return false;
    }
  }

  async delete(query: string, nQuads: string) {
    const mutation = new dgraph.Mutation();
    mutation.setDelNquads(nQuads);

    const request = new dgraph.Request();
    request.setMutationsList([mutation]);

    request.setQuery(query);

    const txn = this.client.newTxn();

    try {
      await txn.doRequest(request);
      txn.discard();
      return true;
    } catch (e) {
      txn.discard();
      return false;
    }
  }
}
