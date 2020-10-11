import { IApolloServiceContext, User, Entity } from '@unified-codes/data';
import { DgraphDataSource, RxNavDataSource } from './data';
import { IEntity, EntityCollection } from '@unified-codes/data';
import { GraphQLResolveInfo } from 'graphql/type';
import { queries } from './queries';
import { mutations } from './mutations';
import { mappers } from './mappers';

export const resolvers = {
  Query: {
    entity: async (_source: any, _args: any, context: IApolloServiceContext) => {
      const { token, authenticator, authoriser, dataSources } = context;
      const dgraph: DgraphDataSource = dataSources.dgraph as DgraphDataSource;
      // TODO: add authorisation logic for any protected entities.
      if (token) {
        const user: User = await authenticator.authenticate(token);
        const isAuthorised = await authoriser.authorise(user);
        console.log(`Entity requested by ${isAuthorised ? 'authorised' : 'unauthorised'} user.`);
      } else {
        console.log(`Entity requested by anonymous user.`);
      }

      const { code } = _args;
      const query = queries.entity(code);
      const response = await dgraph.postQuery(query);
      const [entity] : [IEntity] = response.data.query;
      return entity;
    },
    entities: async (_source: any, args: any, context: IApolloServiceContext) => {
      const { token, authenticator, authoriser, dataSources } = context;
      const dgraph: DgraphDataSource = dataSources.dgraph as DgraphDataSource;
      const { filter, first, offset } = args;

      // TODO: add authorisation logic for any protected entities.
      if (token) {
        const user: User = await authenticator.authenticate(token);
        const isAuthorised = await authoriser.authorise(user);
        console.log(`Entity requested by ${isAuthorised ? 'authorised' : 'unauthorised'} user.`);
      } else {
        console.log(`Entity requested by anonymous user.`);
      }

      const { type = 'drug', code, description, orderBy } = filter ?? {};
      const order = `order${orderBy.descending ? 'desc' : 'asc'}: ${orderBy.field}`;
      const query = queries.entities(type, order, offset, first, description);
      const response = await dgraph.postQuery(query);
      const entities: Array<IEntity> = response.data.query;

      return new EntityCollection(entities, response?.data?.counters[0]?.total);
    },
  },
  Entity: {
    interactions: async (
      parent: IEntity,
      _args: any,
      context: IApolloServiceContext,
      info: GraphQLResolveInfo
    ) => {
      const { dataSources } = context;
      const rxNav: RxNavDataSource = dataSources.rxnav as RxNavDataSource;

      // Workaround to prevent interaction requests for multiple entities
      if (info.path.prev?.key == 'entity') {
        const rxNavIds = parent.properties?.filter(
          (properties) => properties.type == 'code_rxnav'
        );

        if (rxNavIds?.length) {
          const rxCui = rxNavIds[0].value;
          const rxNavResponse = await rxNav.getInteractions(rxCui);
          return mappers.mapInteractionResponse(rxNavResponse);
        }
        console.log(`No RxNavId found for entity with code: ${parent.code}`);
      }
      console.log(`Skipping interactions fetch for ${parent.description}`);
    },
  },
  Mutation : {
    deleteEntity: async (_source: any, _args: any, context: IApolloServiceContext) => {
      const { token, authenticator, authoriser, dataSources } = context;
      const dgraph: DgraphDataSource = dataSources.dgraph as DgraphDataSource;
      // TODO: add authorisation logic for any protected entities.
      if (token) {
        const user: User = await authenticator.authenticate(token);
        const isAuthorised = await authoriser.authorise(user);
        console.log(`Entity deletion requested by ${isAuthorised ? 'authorised' : 'unauthorised'} user.`);
      } else {
        console.log(`Entity deletion requested by anonymous user.`);
      }

      const { code } = _args;
      const mutation = mutations.deleteEntity(code);
      const response = await dgraph.postMutation(mutation);
      console.log(response)
      const success = response.data.code == "Success" ? true : false;
      return { success: success};
    },
  },
};

export default resolvers;
