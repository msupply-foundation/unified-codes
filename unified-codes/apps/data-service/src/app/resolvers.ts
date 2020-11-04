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
  IDrugInteraction,
  IEntity,
  IEntityCollection,
  User,
} from '@unified-codes/data';

import { DgraphDataSource, RxNavDataSource } from './types';
import { DrugInteractionType, EntityCollectionType, EntitySearchInput, EntityType } from './schema';

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

  @FieldResolver((returns) => [DrugInteractionType])
  async interactions(
    @Root() entity: IEntity,
    @Ctx() ctx: IApolloServiceContext
  ): Promise<IDrugInteraction[]> {
    const { dataSources, directiveArguments } = ctx;
    const { rxnav } = dataSources as { rxnav: RxNavDataSource };
    const { severity } = directiveArguments;

    // TODO: cope with changes to severity - should return appropriate interactions not cached results
    return entity.interactions ?? rxnav.getInteractions(entity, severity);
  }
}

export default EntityResolver;
