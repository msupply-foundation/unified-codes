import fastify from 'fastify';
import fastifyCors from 'fastify-cors';

import * as Schema from './schema';
import * as Data from './data';
import * as Resolvers from './resolvers';

import ApolloService from './ApolloService';
import { KeyCloakIdentityProvider } from './IdentityProvider';

export const createApolloServer = (_typeDefs, _resolvers, _dataSources, _authenticator) => {
  const AUTH_URL = 'http://127.0.0.1:9990/auth/realms/unified-codes';

  const getDataSources = () => ({
    DgraphDataSource: new Data.DgraphDataSource(),
    RxNavDataSource: new Data.RxNavDataSource(),
  });
  const typeDefs = _typeDefs ?? Schema.typeDefs;
  const resolvers = _resolvers ?? Resolvers.resolvers;
  const dataSources = _dataSources ?? getDataSources;

  const identityProviderConfig = { baseUrl: AUTH_URL };
  const identityProvider = new KeyCloakIdentityProvider(identityProviderConfig);

  const apolloService = new ApolloService(typeDefs, resolvers, dataSources, identityProvider);
  const apolloServer = apolloService.getServer();

  return apolloServer;
};

export const createFastifyServer = (apolloServer, _plugins) => {
  const apolloPlugin = apolloServer.createHandler();
  const plugins = _plugins ?? [fastifyCors];

  const fastifyServer = fastify({ logger: true });

  [apolloPlugin, ...plugins].forEach((plugin) => {
    fastifyServer.register(plugin);
  });

  return fastifyServer;
};
