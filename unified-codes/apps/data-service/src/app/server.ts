import 'reflect-metadata';

import { ApolloServer } from 'apollo-server-fastify';
import fastify, { FastifyHttp2SecureOptions, FastifyInstance, FastifyLoggerInstance, FastifyPluginCallback, FastifyPluginOptions } from 'fastify';
import { Http2SecureServer, Http2ServerRequest, Http2ServerResponse } from 'http2';

import { ApolloService, DataSources, KeyCloakIdentityProvider, Resolvers, TypeDefs } from '@unified-codes/data/v1';

export type FastifyServer = FastifyInstance<Http2SecureServer, Http2ServerRequest, Http2ServerResponse, FastifyLoggerInstance>
export type FastifyConfig = FastifyHttp2SecureOptions<Http2SecureServer, FastifyLoggerInstance>

export const createApolloServer = async (
  typeDefs: TypeDefs,
  resolvers: Resolvers,
  dataSources: DataSources
): Promise<ApolloServer> => {
  const identityProviderConfig = {
    baseUrl: `${process.env.NX_AUTHENTICATION_SERVICE_URL}:${process.env.NX_AUTHETICATION_SERVICE_PORT}/${process.env.NX_AUTHENTICATION_SERVICE_REALM}/${process.env.NX_AUTHENTICATION_SERVICE_AUTH}`,
    clientId: process.env.NX_AUTHENTICATION_SERVICE_CLIENT_ID,
    clientSecret: process.env.NX_AUTHENTICATION_SERVICE_CLIENT_SECRET,
    grantType: process.env.NX_AUTHENTICATION_SERVICE_GRANT_TYPE,
  };

  const identityProvider = new KeyCloakIdentityProvider(identityProviderConfig);
  const apolloService = new ApolloService(typeDefs, resolvers, dataSources, identityProvider);
  const apolloServer = apolloService.getServer();

  return apolloServer;
};

export const createFastifyServer = (config: FastifyConfig, plugins?: FastifyPluginCallback<FastifyPluginOptions>[]): FastifyServer => {
  const fastifyServer = fastify(config);
  plugins.forEach((plugin) => {
    fastifyServer.register(plugin);
  });
  return fastifyServer;
};
