import { ApolloServer } from 'apollo-server-fastify';
import fastify, {
  FastifyInstance,
  FastifyLoggerInstance,
  FastifyPluginCallback,
  FastifyPluginOptions,
  FastifyServerOptions,
} from 'fastify';
import { IncomingMessage, Server, ServerResponse } from 'http';

import {
  ApolloService,
  DataSources,
  KeyCloakIdentityProvider,
  Resolvers,
  TypeDefs,
} from '../lib/v1';

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
    baseUrl: `${process.env.AUTHENTICATION_SERVICE_URL}:${process.env.AUTHETICATION_SERVICE_PORT}/${process.env.AUTHENTICATION_SERVICE_REALM}/${process.env.AUTHENTICATION_SERVICE_AUTH}`,
    clientId: process.env.AUTHENTICATION_SERVICE_CLIENT_ID,
    clientSecret: process.env.AUTHENTICATION_SERVICE_CLIENT_SECRET,
    grantType: process.env.AUTHENTICATION_SERVICE_GRANT_TYPE,
  };

  const identityProvider = new KeyCloakIdentityProvider(identityProviderConfig);
  const apolloService = new ApolloService(
    typeDefs,
    resolvers,
    dataSources,
    identityProvider
  );
  const apolloServer = apolloService.getServer();

  await apolloServer.start();

  return apolloServer;
};

export const createFastifyServer = (
  config: FastifyConfig,
  plugins?: FastifyPluginCallback<FastifyPluginOptions>[]
): FastifyServer => {
  const fastifyServer = fastify(config);
  plugins.forEach(plugin => {
    fastifyServer.register(plugin);
  });
  return fastifyServer;
};
