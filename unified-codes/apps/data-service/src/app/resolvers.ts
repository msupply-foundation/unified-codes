import { GraphQLResolveInfo } from 'graphql/type';
import {
  Resolver,
  Query,
  Ctx,
  Args,
  ArgsType,
  Field,
  FieldResolver,
  Root,
  Info,
  Int,
} from 'type-graphql';

import {
  User,
  IEntity,
  EntityCollection,
  IApolloServiceContext,
  EEntityType,
} from '@unified-codes/data';

import { DgraphDataSource, RxNavDataSource } from './data';
import { queries } from './queries';
import { mappers } from './mappers';
import { EntitySearchInput, EntityType, EntityCollectionType, DrugInteractionType } from './schema';

@ArgsType()
class GetEntityArgs {
  @Field((type) => String)
  code;
}

@ArgsType()
class GetEntitiesArgs {
  @Field((type) => EntitySearchInput)
  filter;

  @Field((type) => Int)
  first;

  @Field((type) => Int)
  offset;
}

@Resolver((of) => EntityType)
export class EntityResolver {
  @Query((returns) => EntityType)
  async entity(@Args() args: GetEntityArgs, @Ctx() ctx: IApolloServiceContext) {
    const { code } = args;
    const { token, authenticator, authoriser, dataSources } = ctx;

    const dgraph: DgraphDataSource = dataSources.dgraph as DgraphDataSource;

    // TODO: add authorisation logic for any protected entities.
    if (token) {
      const user: User = await authenticator.authenticate(token);
      const isAuthorised = await authoriser.authorise(user);
    }

    const query = queries.entity(code);
    const response = await dgraph.postQuery(query);
    const [entity] = response.data.query;
    return entity;
  }

  @Query((returns) => EntityCollectionType)
  async entities(@Args() args: GetEntitiesArgs, @Ctx() ctx: IApolloServiceContext) {
    const { token, authenticator, authoriser, dataSources } = ctx;
    const dgraph: DgraphDataSource = dataSources.dgraph as DgraphDataSource;
    const { filter, first, offset } = args;

    // TODO: add authorisation logic for any protected entities.
    if (token) {
      const user: User = await authenticator.authenticate(token);
      const isAuthorised = await authoriser.authorise(user);
    }

    const { type = EEntityType.DRUG, code, description, orderBy } = filter ?? {};
    const order = `order${orderBy.descending ? 'desc' : 'asc'}: ${orderBy.field}`;
    const query = queries.entities(type, order, offset, first, description);
    const response = await dgraph.postQuery(query);
    const entities: Array<IEntity> = response.data.query;

    return new EntityCollection(entities, response?.data?.counters[0]?.total);
  }

  @FieldResolver((returns) => [DrugInteractionType])
  async interactions(
    @Root() entity: IEntity,
    @Ctx() ctx: IApolloServiceContext,
    @Info() info: GraphQLResolveInfo
  ) {
    const { dataSources } = ctx;
    const rxNav: RxNavDataSource = dataSources.rxnav as RxNavDataSource;

    // Workaround to prevent interaction requests for multiple entities
    if (info.path.prev?.key == 'entity') {
      const rxNavIds = entity.properties?.filter((properties) => properties.type == 'code_rxnav');

      if (rxNavIds?.length) {
        const rxCui = rxNavIds[0].value;
        const rxNavResponse = await rxNav.getInteractions(rxCui);
        return mappers.mapInteractionResponse(rxNavResponse);
      }
      console.log(`No RxNavId found for entity with code: ${entity.code}`);
    }
    console.log(`Skipping interactions fetch for ${entity.description}`);
  }
}

export default EntityResolver;
