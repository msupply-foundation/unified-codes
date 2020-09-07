import { IApolloServiceContext, User } from '@unified-codes/data';
import { DgraphDataSource } from './data';
import { getPaginatedResults } from './utils';
import { IEntity, IPaginationParameters } from '@unified-codes/data';

const queries = {
  entity: (code: string) => {
    return `{
        query(func: eq(code, ${code}), first: 1) @recurse(loop: false)  {
          code
          description
          type
          value
          has_child
          has_property
        }
      }`;
  },
  entities: (type: string) => {
    return `{
      query(func: eq(type, ${type})) @filter(has(description)) @recurse(loop: false)  {
        code
        description
        type
        value
        has_child
        has_property
      }
    }`;
  },
};

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
      const { after, filter, pageSize = 20 } = args;

      // TODO: add authorisation logic for any protected entities.
      if (token) {
        const user: User = await authenticator.authenticate(token);
        const isAuthorised = await authoriser.authorise(user);
        console.log(`Entity requested by ${isAuthorised ? 'authorised' : 'unauthorised'} user.`);
      } else {
        console.log(`Entity requested by anonymous user.`);
      }

      const { type = 'medicinal_product' } = args?.filter ?? {};
      const query = queries.entities(type);
      const response = await dgraph.postQuery(query);
      const allEntities: Array<IEntity> = response.data.query;
      const paginationParameters: IPaginationParameters<IEntity> = {
        after,
        pageSize,
        results: allEntities,
      };
      return getPaginatedResults<IEntity>(paginationParameters);
    },
  },
};

export default resolvers;
