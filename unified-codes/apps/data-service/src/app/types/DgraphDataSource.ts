import { RESTDataSource } from 'apollo-datasource-rest';

import {
  EEntityField,
  EEntityType,
  EntityCollection,
  IEntity,
  IEntityCollection,
} from '@unified-codes/data';
import { EntitySearchInput, FilterMatch } from '../schema';

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

  // the @filter directive with regexp is needed due to what appears to be a limitation on depth
  // without it the query only works for some nodes. limiting the size of the result set before
  // applying the lower level filter ensures results are returned.
  private static getProductQuery(code: string, name: string) {
    return `{
      query (func: eq(type, "drug")) @filter(regexp(description, /${name.substr(
        0,
        3
      )}/i)) @cascade {
        code
        description
        properties: has_property {
          type
          value
        }
        has_child {
          has_child {
            has_child @filter(eq(code, ${code})) {
            }
          }
        }
      }
    }`;
  }

  private static getEntitiesFilterString(description: string, match: FilterMatch) {
    if (!description) {
      return '@filter(has(description))';
    }

    switch (match) {
      case 'exact':
        return `@filter(regexp(description, /^${description}$/i))`;

      case 'contains':
        return `@filter(regexp(description, /${description}/i))`;

      default:
        return `@filter(regexp(description, /^${description}/i))`;
    }
  }

  private static getEntitiesQuery(
    type: string,
    description?: string,
    orderField?: string,
    orderDesc?: boolean,
    first?: number,
    offset?: number,
    match?: FilterMatch
  ) {
    const orderString = `${orderDesc ? 'orderdesc' : 'orderasc'}: ${orderField}`;
    const filterString = this.getEntitiesFilterString(description, match);

    return `{
      all as counters(func: anyofterms(type, "${type}")) ${filterString} { 
        total: count(uid)
      }
      
      query(func: uid(all), ${orderString}, offset: ${offset}, first: ${first})  {
        code
        description
        type
        properties: has_property {
          type
          value
        }
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

  async getProduct(code: string, name: string): Promise<IEntity> {
    const data = await this.postQuery(DgraphDataSource.getProductQuery(code, name));

    const { query } = data ?? {};
    const [entity] = query ?? [];
    return entity;
  }

  async getEntities(
    filter?: EntitySearchInput,
    first?: number,
    offset?: number
  ): Promise<IEntityCollection> {
    const { type = EEntityType.DRUG, description, match, orderBy } = filter ?? {};
    const { field: orderField = EEntityField.DESCRIPTION, descending: orderDesc = true } =
      orderBy ?? {};

    const data = await this.postQuery(
      DgraphDataSource.getEntitiesQuery(
        type,
        description,
        orderField,
        orderDesc,
        first,
        offset,
        match
      )
    );

    const { counters: countersData, query: entityData } = data ?? {};
    const [counterData] = countersData;
    const totalCount = counterData?.total;

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
