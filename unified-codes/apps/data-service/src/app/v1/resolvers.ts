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

import { IApolloServiceContext, User } from '@unified-codes/data';

import { DgraphDataSource, RxNavDataSource, IDrugInteraction, IEntity, IEntityCollection } from './types';
import { DrugInteractionType, EntityCollectionType, EntitySearchInput, EntityType } from './schema';

@ArgsType()
class GetEntityArgs {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Field((type) => String)
  code;
}

@ArgsType()
class GetEntitiesArgs {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Field((type) => EntitySearchInput)
  filter;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Field((type) => Int)
  first;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Field((type) => Int)
  offset;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
@Resolver((of) => EntityType)
export class EntityResolver {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Query((returns) => EntityType)
  async entity(@Args() args: GetEntityArgs, @Ctx() ctx: IApolloServiceContext): Promise<IEntity> {
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
  @Query((returns) => EntityCollectionType)
  async entities(@Args() args: GetEntitiesArgs, @Ctx() ctx: IApolloServiceContext): Promise<IEntityCollection> {
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
  @FieldResolver((returns) => [DrugInteractionType])
  async interactions(@Root() entity: IEntity, @Ctx() ctx: IApolloServiceContext): Promise<IDrugInteraction[]> {
    const { dataSources } = ctx;
    const { rxnav } = dataSources as { rxnav: RxNavDataSource };

    return entity.interactions ?? rxnav.getInteractions(entity);
  }
}

export default EntityResolver;
