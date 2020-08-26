import fastify from 'fastify';
import { ApolloServer } from 'apollo-server-fastify';

import * as Schema from './schema';
import * as Data from './data';
import * as Resolvers from './resolvers';

import { ApolloService, KeyCloakIdentityProvider } from '@unified-codes/data';

export const createApolloServer = (typeDefs?, resolvers?, dataSources?): ApolloServer => {
  const _typeDefs = typeDefs ?? Schema.typeDefs;
  const _resolvers = resolvers ?? Resolvers.resolvers;
  const _dataSources =
    dataSources ??
    (() => ({
      dgraph: new Data.DgraphDataSource(),
      rxnav: new Data.RxNavDataSource(),
    }));

  const identityProviderConfig = {
    baseUrl: `${process.env.AUTHENTICATION_SERVICE_URL}:${process.env.AUTHETICATION_SERVICE_PORT}/${process.env.AUTHENTICATION_SERVICE_REALM}/${process.env.AUTHENTICATION_SERVICE_AUTH}`,
    clientId: process.env.AUTHENTICATION_SERVICE_CLIENT_ID,
    clientSecret: process.env.AUTHENTICATION_SERVICE_CLIENT_SECRET,
    grantType: process.env.AUTHENTICATION_SERVICE_GRANT_TYPE,
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
