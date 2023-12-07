import { RequestOptions, RESTDataSource } from 'apollo-datasource-rest';

import { IEntity } from '@unified-codes/data/v1';

import { getEntityQuery } from './queries/entityQuery';

export class DgraphGqlDataSource extends RESTDataSource {
  private static headers: { [key: string]: string } = {
    'Content-Type': 'application/json',
  };

  constructor() {
    super();
    this.baseURL = `${process.env.NX_DGRAPH_SERVICE_URL}:${process.env.NX_DGRAPH_SERVICE_PORT}`;
  }

  willSendRequest(request: RequestOptions): void {
    Object.entries(DgraphGqlDataSource.headers).forEach(([key, value]) =>
      request.headers.set(key, value)
    );
  }

  // map empty properties arrays to a null value as it is in the existing schema..
  private static mapEntity(entity: IEntity) {
    if (!entity) return entity;

    const children = entity.children?.map((c) => DgraphGqlDataSource.mapEntity(c));

    const properties = entity.properties?.length ? entity.properties : null;

    return { ...entity, properties, children };
  }

  async getEntity(code: string): Promise<IEntity> {
    const data = await this.postQuery(getEntityQuery(code));
    const { queryEntity } = data ?? {};
    const [entity]: [IEntity] = queryEntity ?? [];

    return DgraphGqlDataSource.mapEntity(entity);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async postQuery(query: string): Promise<any> {
    const response = await this.post(
      '/graphql',
      JSON.stringify({
        query,
      })
    );
    const { data, errors } = response;

    if (!data) {
      console.error('Error querying DGraph: ', JSON.stringify(errors));
      throw new Error('Could not query data');
    }

    return data;
  }
}
