import { IApolloServiceContext, User } from '@unified-codes/data';
import { DgraphDataSource } from './data';
import { IEntity, EntityCollection } from '@unified-codes/data';
import { queries } from './queries';

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
      const [entity] = response.data.query;
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

      const { type = 'medicinal_product', code, description, orderDesc, orderBy } = filter ?? {};
      const order = `order${orderDesc ? 'desc' : 'asc'}: ${orderBy}`;
      const query = queries.entities(type, order, offset, first, description);
      const response = await dgraph.postQuery(query);
      const entities: Array<IEntity> = response.data.query;

      return new EntityCollection(entities, response?.data?.counters[0]?.total, first, offset);
    },
  },
};

export default resolvers;
