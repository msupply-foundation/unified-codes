import { RequestOptions, RESTDataSource } from 'apollo-datasource-rest';

import {
  EEntityField,
  EEntityType,
  IEntity,
  EntityCollection,
  IEntityCollection
} from '@unified-codes/data/v1';

import { EntitySearchInput, FilterMatch } from '../schema';

export class DgraphDataSource extends RESTDataSource {
  private static headers: { [key: string]: string } = {
    'Content-Type': 'application/graphql+-',
  };

  private static paths: { [key: string]: string } = {
    query: 'query',
  };

  private static getEntitiesOrderString(orderField: string = EEntityField.DESCRIPTION, orderDesc = false) {
    const orderBy = orderField === EEntityField.DESCRIPTION ? 'name' : orderField;
    const orderString = `${orderDesc ? 'orderdesc' : 'orderasc'}: ${orderBy}`;
    return orderString;
  }

  private static getEntityTypeString(type: string) {
    switch(type) {
      case EEntityType.DRUG:
      case EEntityType.MEDICINAL_PRODUCT:
      case EEntityType.OTHER:
      default:
        return 'Product'
    }
  }

  private static getEntityCategoryString(type: string) {
    switch(type) {
      case EEntityType.DRUG:
        return 'Drug';
      case EEntityType.MEDICINAL_PRODUCT:
        return 'Consumable';
      case EEntityType.OTHER:
        return 'Other';
    }
  }

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

  private static getProductQuery(code: string) {
    return `{
      query (func: eq(type, "drug")) @cascade {
        code
        description
        properties: has_property {
          type
          value
        }
        has_child {
          has_child {
            has_child @filter(alloftext(code, ${code})) {
            }
          }
        }
      }
    }`;
  }

  private static getEntitiesFilterString(description: string, match: FilterMatch) {
    if (!description) {
      return '@filter(has(name))';
    }

    switch (match) {
      case 'exact':
        return `@filter(regexp(name, /^${description}$/i))`;

      case 'contains':
        return `@filter(regexp(name, /${description}/i))`;

      default:
        return `@filter(regexp(name, /^${description}/i))`;
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
    const typeString = this.getEntityTypeString(type);
    const categoryString = this.getEntityCategoryString(type);
    const orderString = this.getEntitiesOrderString(orderField, orderDesc);
    const filterString = this.getEntitiesFilterString(description, match);

    return `{
      all as counters(func: eq(dgraph.type, "${typeString}")) ${filterString} @cascade { 
        ~children @filter(eq(name, "${categoryString}"))
        total: count(uid)
      }
      
      query(func: uid(all), ${orderString}, offset: ${offset}, first: ${first})  {
        code
        description: name@*
        type: dgraph.type
        uid
        properties {
          type
          value
        }
      }
    }`;
  }

  private static getEntityType(entity: IEntity): string {
    const { type: types } = entity;
    const [type] = types ?? [];
  
    switch (type) {
      case "Product":
        return "drug";
      case "Route":
        return "form_category";
      case "DoseForm":
        return "form";
      case "DoseFormQualifier":
      case "DoseStrength":
      case "DoseUnit":
        return "unit_of_use"
      default:
        return "n/a";
    }
  }

  constructor() {
    super();
    this.baseURL = `${process.env.NX_DGRAPH_SERVICE_URL}:${process.env.NX_DGRAPH_SERVICE_PORT}`;
  }

  willSendRequest(request: RequestOptions): void {
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

  async getProduct(code: string): Promise<IEntity> {
    const data = await this.postQuery(DgraphDataSource.getProductQuery(code));

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
    const { field: orderField = EEntityField.DESCRIPTION, descending: orderDesc = false } =
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
    const [counterData] = countersData ?? [];
    const totalCount = counterData?.total ?? 0;


    const entities: IEntity[] =
      entityData?.map((entity: IEntity) => {
        // Map native graph node types.
        const type = DgraphDataSource.getEntityType(entity);

        // Overwrite interactions to prevent large query delays.
        const interactions = [];

        return ({ ...entity, type, interactions });
      });

    return new EntityCollection(entities, totalCount);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async postQuery(query: string): Promise<any> {
    const response = await this.post(DgraphDataSource.paths.query, query);
    const { data } = response;
    return data;
  }
}
