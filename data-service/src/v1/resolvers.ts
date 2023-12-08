import {
  Args,
  ArgsType,
  Ctx,
  Field,
  FieldResolver,
  Int,
  Query,
  Resolver,
  Root,
} from 'type-graphql';

import {
  IApolloServiceContext,
  IDrugInteractions,
  IEntity,
  IEntityCollection,
  User,
} from '../lib/v1';

import {
  DgraphDataSource,
  RxNavDataSource,
  RxNavInteractionSeverity,
} from './types';

import {
  DrugInteractionsType,
  EntityCollectionType,
  EntitySearchInput,
  EntityType,
} from './schema';
import { DgraphGqlDataSource } from './types/DgraphGqlDataSource';

@ArgsType()
class GetEntityArgs {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Field(type => String)
  code;
}

@ArgsType()
class GetEntitiesArgs {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Field(type => EntitySearchInput)
  filter;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Field(type => Int)
  first;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Field(type => Int)
  offset;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
@ArgsType()
class GetInteractionsArgs {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Field(type => String)
  code;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Field(type => String, { nullable: true })
  severity;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
@Resolver(of => EntityType)
export class EntityResolver {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Query(returns => EntityType, { nullable: true })
  async entity(
    @Args() args: GetEntityArgs,
    @Ctx() ctx: IApolloServiceContext
  ): Promise<IEntity> {
    const { code } = args;
    const { token, authenticator, authoriser, dataSources } = ctx;

    const dgraph: DgraphDataSource = dataSources.dgraph as DgraphDataSource;

    // TODO: add authorisation logic for any protected entities.
    if (token) {
      const user: User = await authenticator.authenticate(token);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const isAuthorised = await authoriser.authorise(user);
    }

    return dgraph.getEntity(code);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Query(returns => EntityType, { nullable: true })
  async entity2(
    @Args() args: GetEntityArgs,
    @Ctx() ctx: IApolloServiceContext
  ): Promise<IEntity> {
    const { code } = args;
    const { token, authenticator, authoriser, dataSources } = ctx;

    const dgraphGql: DgraphGqlDataSource =
      dataSources.dgraphGql as DgraphGqlDataSource;

    // TODO: add authorisation logic for any protected entities.
    if (token) {
      const user: User = await authenticator.authenticate(token);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const isAuthorised = await authoriser.authorise(user);
    }

    return dgraphGql.getEntity(code);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @FieldResolver(returns => EntityType)
  async product(
    @Root() entity: IEntity,
    @Ctx() ctx: IApolloServiceContext
  ): Promise<IEntity> {
    const { code } = entity;
    const { dataSources } = ctx;
    const dgraph: DgraphDataSource = dataSources.dgraph as DgraphDataSource;

    return dgraph.getProduct(code);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Query(returns => EntityCollectionType)
  async entities(
    @Args() args: GetEntitiesArgs,
    @Ctx() ctx: IApolloServiceContext
  ): Promise<IEntityCollection> {
    const { filter, first, offset } = args;
    const { token, authenticator, authoriser, dataSources } = ctx;

    const dgraph: DgraphDataSource = dataSources.dgraph as DgraphDataSource;

    // TODO: add authorisation logic for any protected entities.
    if (token) {
      const user: User = await authenticator.authenticate(token);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const isAuthorised = await authoriser.authorise(user);
    }

    return dgraph.getEntities(filter, first, offset);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Query(returns => DrugInteractionsType)
  async interactions(
    @Args() args: GetInteractionsArgs,
    @Ctx() ctx: IApolloServiceContext
  ): Promise<IDrugInteractions> {
    const { code, severity } = args;
    const { dataSources } = ctx;
    const { dgraph, rxnav } = dataSources as {
      dgraph: DgraphDataSource;
      rxnav: RxNavDataSource;
    };
    const product = await dgraph.getProduct(code);
    const entity = await dgraph.getEntity(code);

    return rxnav.getInteractions(
      product || entity,
      severity as RxNavInteractionSeverity | undefined
    );
  }
}

export default EntityResolver;
