import fastify from 'fastify';
import { ApolloServer } from 'apollo-server-fastify';

import * as Schema from './schema';
import * as Data from './data';
import * as Resolvers from './resolvers';

import { ApolloService, KeyCloakIdentityProvider } from '@unified-codes/data';

export const createApolloServer = (typeDefs?, resolvers?, dataSources?): ApolloServer => {
  const AUTH_URL = process.env.NX_AUTHENTICATION_URL;

  const _typeDefs = typeDefs ?? Schema.typeDefs;
  const _resolvers = resolvers ?? Resolvers.resolvers;
  const _dataSources = dataSources ?? (() => ({
    dgraph: new Data.DgraphDataSource(),
    rxnav: new Data.RxNavDataSource(),
  }));

  const identityProviderConfig = {
    baseUrl: AUTH_URL,
    clientId: '',
    clientSecret: '',
    grantType: '',
  };

  const identityProvider = new KeyCloakIdentityProvider(identityProviderConfig);
  const apolloService = new ApolloService(_typeDefs, _resolvers, _dataSources, identityProvider);
  const apolloServer = apolloService.getServer();

  return apolloServer;
};

export const createFastifyServer = (config, plugins?) => {
  const fastifyServer = fastify(config);
  plugins.forEach((plugin) => {
    fastifyServer.register(plugin);
  });
  return fastifyServer;
};

