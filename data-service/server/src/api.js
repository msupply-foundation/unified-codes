import { ApolloServer } from 'apollo-server-fastify';
import fastify from 'fastify';
import fastifyCors from 'fastify-cors';
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

const apolloPlugin = server.createHandler();
const corsPlugin = fastifyCors;

const graphApi = fastify({ logger: true });
graphApi.register(apolloPlugin);
graphApi.register(corsPlugin)

export default graphApi;
