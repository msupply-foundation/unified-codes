import { ApolloServer } from 'apollo-server-fastify';
import fastify from 'fastify';
import { typeDefs } from './schema';
import { dgraph } from './data';

const resolvers = {
  Query: {
    searchByName: async (_source, _args, { dataSources }) => {
      const dgraphQuery = `{
        query(func: has(code)) @filter(regexp(description, /^${_args.text}.*$/i) AND eq(type, "unit_of_use")) {
          code
          description
        }
      }`;
      const resp = await dataSources.dgraphDataSource.postQuery(dgraphQuery);
      return resp.data.query;
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => {
    return {
      dgraphDataSource: new dgraph(),
    };
  },
});

const graphApi = fastify({ logger: true });
graphApi.register(server.createHandler());

export default graphApi;
