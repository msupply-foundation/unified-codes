import { ApolloServer } from 'apollo-server-fastify';
import { typeDefs } from './schema'
import fastify from 'fastify';

const resolvers = {
  Query: {
    searchByName: (parent, args, context, info) => {
      return [
        { code: 'ABC', description: 'test1' },
        { code: 'DEF', description: 'test2' }
      ]
    }
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers
});

const graphApi = fastify({ logger: true });
graphApi.register(server.createHandler());

export default graphApi;