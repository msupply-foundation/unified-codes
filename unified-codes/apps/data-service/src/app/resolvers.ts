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

import { IApolloServiceContext, IEntity, IEntityCollection, User } from '@unified-codes/data';

import { DgraphDataSource, RxNavDataSource, RxNavInteractionSeverity } from './types';
import {
  DrugInteractionsType,
  EntityCollectionType,
  EntitySearchInput,
  EntityType,
} from './schema';

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

@ArgsType()
class GetInteractionsArgs {
  @Field((type) => String)
  code;

  @Field((type) => String, { nullable: true })
  severity;
}

@Resolver((of) => EntityType)
export class EntityResolver {
  @Query((returns) => EntityType)
  async entity(@Args() args: GetEntityArgs, @Ctx() ctx: IApolloServiceContext): Promise<IEntity> {
    const { code } = args;
    const { token, authenticator, authoriser, dataSources } = ctx;

    const dgraph: DgraphDataSource = dataSources.dgraph as DgraphDataSource;

    // TODO: add authorisation logic for any protected entities.
    if (token) {
      const user: User = await authenticator.authenticate(token);
      const isAuthorised = await authoriser.authorise(user);
    }

    return dgraph.getEntity(code);
  }

  @FieldResolver((returns) => EntityType)
  async product(@Root() entity: IEntity, @Ctx() ctx: IApolloServiceContext): Promise<IEntity> {
    const { code } = entity;
    const { dataSources } = ctx;
    const dgraph: DgraphDataSource = dataSources.dgraph as DgraphDataSource;

    return dgraph.getProduct(code);
  }

  @Query((returns) => EntityCollectionType)
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
      const isAuthorised = await authoriser.authorise(user);
    }

    return dgraph.getEntities(filter, first, offset);
  }

  @Query((returns) => DrugInteractionsType)
  async interactions(
    @Args() args: GetInteractionsArgs,
    @Ctx() ctx: IApolloServiceContext
  ): Promise<DrugInteractionsType> {
    const { code, severity } = args;
    const { dataSources } = ctx;
    const { dgraph, rxnav } = dataSources as { dgraph: DgraphDataSource; rxnav: RxNavDataSource };
    const entity = await dgraph.getEntity(code);

    return rxnav.getInteractions(entity, severity as RxNavInteractionSeverity | undefined);
  }
}

export default EntityResolver;
