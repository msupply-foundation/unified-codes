import { RequestOptions, RESTDataSource } from 'apollo-datasource-rest';

import {
  EEntityCategory,
  EEntityField,
  EEntitySortOrder,
  EEntityType,
  EntityCollection,
  IEntity,
  IEntityCollection,
  IProperty,
} from '@unified-codes/data/v1';

import {
  EEntityCategory as EEntityCategoryV2,
  EEntityField as EEntityFieldV2,
  EEntityType as EEntityTypeV2,
} from '@unified-codes/data/v2';

import { EntitySearchInput, FilterMatch } from '../schema';

export class DgraphDataSource extends RESTDataSource {
  private static headers: { [key: string]: string } = {
    'Content-Type': 'application/graphql+-',
  };

  private static paths: { [key: string]: string } = {
    query: 'query',
  };

  private static getEntitiesOrderString(
    orderField: string = EEntityField.DESCRIPTION,
    orderDesc = false
  ) {
    const orderDescString = (orderDesc && EEntitySortOrder.Desc) || EEntitySortOrder.Asc;
    const orderFieldString =
      orderField === EEntityField.DESCRIPTION ? EEntityFieldV2.Name : orderField;
    const orderString = `${orderDescString} : ${orderFieldString}`;
    return orderString;
  }

  private static getEntityTypeString(types: string[]) {
    return JSON.stringify(
      types.map((type) => {
        switch (type) {
          case EEntityType.FORM_CATEGORY:
            return EEntityTypeV2.Form;
          case EEntityType.FORM:
            return EEntityTypeV2.FormQualifier;
          case EEntityType.UNIT_OF_USE:
            return EEntityTypeV2.Unit;
          case EEntityType.STRENGTH:
            return EEntityTypeV2.DoseStrength;
          case EEntityType.DRUG:
          default:
            return EEntityTypeV2.Product;
        }
      })
    );
  }

  private static getEntityCategoryString(categories: string[]) {
    return JSON.stringify(
      categories.map((category) => {
        switch (category) {
          case EEntityCategory.DRUG:
            return EEntityCategoryV2.DRUG;
          case EEntityCategory.CONSUMABLE:
            return EEntityCategoryV2.CONSUMABLE;
          case EEntityCategory.OTHER:
            return EEntityCategoryV2.OTHER;
        }
      })
    );
  }

  private static getEntityQuery(code: string) {
    return `{
      query(func: eq(code, ${code?.toLowerCase()}), first:1) @recurse(loop:false) {
        code
        type: dgraph.type
        description: name
        value
        combines
        children
        parents: ~children
        properties
      }
    }`;
  }

  private static getProductQuery(code: string) {
    return `{
      query (func: eq(dgraph.type, "Product")) @cascade {
        code
        type: dgraph.type
        description: name
        properties {
          type: dgraph.type
          value
        }
        children {
          children {
            children @filter(alloftext(code, ${code})) {
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
    types: string[],
    categories?: string[],
    description?: string,
    orderField?: string,
    orderDesc?: boolean,
    first?: number,
    offset?: number,
    match?: FilterMatch
  ) {
    const typeString = this.getEntityTypeString(types);
    const categoryString = this.getEntityCategoryString(categories);
    const orderString = this.getEntitiesOrderString(orderField, orderDesc);
    const filterString = this.getEntitiesFilterString(description, match);

    // Required for backwards compatiblility with broken mSupply query.
    // Query incorrectly specifies medical_product as a type instead of category.
    const isMsupply = types.includes(EEntityCategory.MEDICINAL_PRODUCT);

    // TODO: migrate query to mSupply and remove hardcoded query mapping.
    if (isMsupply) {
      return `{
        query(func: eq(dgraph.type, ["Unit", "DoseStrength"]), ${orderString}, offset: ${offset}, first: ${first}) ${filterString}  {
          code
          description: name
          type: dgraph.type
          uid
          properties {
            type: dgraph.type
            value
          }
        }
      }`;
    }

    return `{
      all as counters(func: eq(dgraph.type, ${typeString})) ${filterString} @cascade { 
        ~children @filter(eq(name, ${categoryString}))
        total: count(uid)
      }
      
      query(func: uid(all), ${orderString}, offset: ${offset}, first: ${first})  {
        code
        description: name
        type: dgraph.type
        uid
        properties {
          type: dgraph.type
          value
        }
        parents: ~children {
          type: dgraph.type
          description: name
        }
      }
    }`;
  }

  private static getEntityType(entity: IEntity): string {
    const { type: dgraphType } = entity;
    const types = (dgraphType as unknown) as string[]; // dgraph.type is string[]

    // "Entity" is an additional type to allow graphql querying across many entity types
    // We want the specific type here
    const type = (types ?? []).find((t) => t !== 'Entity');

    switch (type) {
      case EEntityTypeV2.Product:
        const [parent] = entity.parents ?? [];
        switch (parent?.description) {
          case EEntityCategoryV2.CONSUMABLE:
            return EEntityCategory.CONSUMABLE;
          case EEntityCategoryV2.OTHER:
            return EEntityCategory.OTHER;
          default:
            return EEntityCategory.DRUG;
        }
      case EEntityTypeV2.Route:
        return EEntityType.FORM_CATEGORY;
      case EEntityTypeV2.Form:
        return EEntityType.FORM;
      case EEntityTypeV2.FormQualifier:
        return EEntityType.FORM_QUALIFIER;
      case EEntityTypeV2.DoseStrength:
        return EEntityType.STRENGTH;
      case EEntityTypeV2.Unit:
        return EEntityType.UNIT_OF_USE;
      default:
        return type;
    }
  }

  // maps from the `type` property returned, which is of `dgraph.type` and therefore string[]
  // to a single string value for `type`
  private static getPropertyType(property: IProperty): string {
    const { type: types } = property;
    const [type] = types ?? [];
    return type;
  }

  private static mapEntity = (entity: IEntity) => {
    if (!entity) return entity;

    // Map native graph node types.
    const type = DgraphDataSource.getEntityType(entity);
    const children = entity.children?.map((child) => DgraphDataSource.mapEntity(child));
    const parents = entity.parents?.map((parent) => DgraphDataSource.mapEntity(parent));

    entity.properties = entity.properties?.map((property) => ({
      ...property,
      type: DgraphDataSource.getPropertyType(property),
    }));

    return { ...entity, type, children, parents };
  };

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
    const [entity]: [IEntity] = query ?? [];

    return DgraphDataSource.mapEntity(entity);
  }

  async getProduct(code: string): Promise<IEntity> {
    const data = await this.postQuery(DgraphDataSource.getProductQuery(code));

    const { query } = data ?? {};
    const [entity] = query ?? [];

    return DgraphDataSource.mapEntity(entity);
  }

  async getEntities(
    filter?: EntitySearchInput,
    first?: number,
    offset?: number
  ): Promise<IEntityCollection> {
    const {
      categories = [EEntityCategory.DRUG, EEntityCategory.CONSUMABLE, EEntityCategory.OTHER],
      type = EEntityType.DRUG,
      description,
      match,
      orderBy,
    } = filter ?? {};
    const { field: orderField = EEntityField.DESCRIPTION, descending: orderDesc = false } =
      orderBy ?? {};

    const types = type.replace(/[[\]]+/g, '').split(/[\s,]+/);

    const data = await this.postQuery(
      DgraphDataSource.getEntitiesQuery(
        types,
        categories,
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

    const entities: IEntity[] = entityData?.map((entity: IEntity) => {
      // Overwrite interactions to prevent large query delays.
      const interactions = [];

      return { ...DgraphDataSource.mapEntity(entity), interactions };
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
