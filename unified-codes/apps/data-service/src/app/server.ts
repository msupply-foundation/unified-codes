import 'reflect-metadata';

import { ApolloServer } from 'apollo-server-fastify';
import fastify, { FastifyServerOptions, FastifyInstance, FastifyLoggerInstance } from 'fastify';
import { IncomingMessage, Server, ServerResponse } from 'http';

import {
  ApolloService,
  DataSources,
  KeyCloakIdentityProvider,
  Resolvers,
  TypeDefs,
} from '@unified-codes/data/v1';

export type FastifyServer = FastifyInstance<
  Server,
  IncomingMessage,
  ServerResponse,
  FastifyLoggerInstance
>;
export type FastifyConfig = FastifyServerOptions<Server, FastifyLoggerInstance>;

export const createApolloServer = async (
  typeDefs: TypeDefs,
  resolvers: Resolvers,
  dataSources: DataSources
): Promise<ApolloServer> => {
  const identityProviderConfig = {
    baseUrl: `${process.env.NX_AUTHENTICATION_SERVICE_URL}:${process.env.NX_AUTHENTICATION_SERVICE_PORT}/${process.env.NX_AUTHENTICATION_SERVICE_REALM}/${process.env.NX_AUTHENTICATION_SERVICE_AUTH}`,
    clientId: process.env.NX_AUTHENTICATION_SERVICE_CLIENT_ID,
    clientSecret: process.env.NX_AUTHENTICATION_SERVICE_CLIENT_SECRET,
    grantType: process.env.NX_AUTHENTICATION_SERVICE_GRANT_TYPE,
  };

  const identityProvider = new KeyCloakIdentityProvider(identityProviderConfig);
  const apolloService = new ApolloService(typeDefs, resolvers, dataSources, identityProvider);
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
