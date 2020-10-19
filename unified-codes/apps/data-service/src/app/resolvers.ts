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
  IApolloServiceContext,
} from '@unified-codes/data';

import { DgraphDataSource, RxNavDataSource } from './types';
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

    return dgraph.getEntity(code);
  }

  @Query((returns) => EntityCollectionType)
  async entities(@Args() args: GetEntitiesArgs, @Ctx() ctx: IApolloServiceContext) {
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

  @FieldResolver((returns) => [DrugInteractionType])
  async interactions(
    @Root() entity: IEntity,
    @Ctx() ctx: IApolloServiceContext,
  ) {
    const { dataSources } = ctx;
    const { rxnav } = dataSources as { rxnav: RxNavDataSource };

    return entity.interactions ?? rxnav.getInteractions(entity);
  }
}

export default EntityResolver;
