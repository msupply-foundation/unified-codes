import { RESTDataSource } from 'apollo-datasource-rest';

import {
  EEntityField,
  EEntityType,
  EntityCollection,
  IEntity,
  IEntityCollection,
} from '@unified-codes/data';

export class DgraphDataSource extends RESTDataSource {
  private static headers: { [key: string]: string } = {
    'Content-Type': 'application/graphql+-',
  };

  private static paths: { [key: string]: string } = {
    query: 'query',
  };

  private static getEntityQuery(code: string) {
    return `{
      query(func: eq(code, ${code}), first: 1) @recurse(loop: false)  {
        code
        description
        type
        value
        children: has_child
        properties: has_property
      }
    }`;
  }

  private static getEntitiesQuery(type, description, orderField, orderDesc, first, offset) {
    const orderString = `${orderDesc ? 'orderdesc' : 'orderasc'}: ${orderField}`;
    const filterString = description
      ? `@filter(regexp(description, /.*${description}.*/i))`
      : '@filter(has(description))';

    return `{
      all as counters(func: anyofterms(type, "${type}")) ${filterString} { 
        total: count(uid)
      }
      
      query(func: uid(all), ${orderString}, offset: ${offset}, first: ${first}) @recurse(loop: false)  {
        code
        description
        type
        uid
        value
        children: has_child
        properties: has_property
      }
    }`;
  }

  constructor() {
    super();
    this.baseURL = `${process.env.NX_DGRAPH_SERVICE_URL}:${process.env.NX_DGRAPH_SERVICE_PORT}`;
  }

  willSendRequest(request) {
    Object.entries(DgraphDataSource.headers).forEach(([key, value]) =>
      request.headers.set(key, value)
    );
  }

  async getEntity(code: string): Promise<IEntity> {
    const data = await this.postQuery(DgraphDataSource.getEntityQuery(code));

    const { query } = data ?? {};
    const [entity] = query ?? [];
    return entity;
  }

  async getEntities(filter, first, offset): Promise<IEntityCollection> {
    const { type = EEntityType.DRUG, description, orderBy } = filter ?? {};
    const { field: orderField = EEntityField.DESCRIPTION, descending: orderDesc = true } =
      orderBy ?? {};

    const data = await this.postQuery(
      DgraphDataSource.getEntitiesQuery(type, description, orderField, orderDesc, first, offset)
    );

    const { counters: counterData, query: entityData } = data ?? {};
    const [totalCount] = counterData?.total ?? [];
    // Overwrite interactions to prevent large query delays.
    const entities: IEntity[] =
      entityData?.map((entity: IEntity) => ({ ...entity, interactions: [] })) ?? [];

    return new EntityCollection(entities, totalCount);
  }

  async postQuery(query) {
    const response = await this.post(DgraphDataSource.paths.query, query);
    const { data } = response;
    return data;
  }
}
