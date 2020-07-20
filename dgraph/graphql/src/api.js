import { ApolloServer } from 'apollo-server-fastify';
import fastify from 'fastify';
import { typeDefs } from './schema';
import { DgraphDataSource, RxNavDataSource } from './data';
import { resolvers } from './resolvers'

const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => {
    return {
      dgraph: new DgraphDataSource(),
      rxNav: new RxNavDataSource()
    };
  },
});

const graphApi = fastify({ logger: true });
graphApi.register(server.createHandler());

export default graphApi;
