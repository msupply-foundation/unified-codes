import 'reflect-metadata';

import fastifyCors from '@fastify/cors';
import { buildTypeDefsAndResolvers } from 'type-graphql';

import { EntityResolver } from './v1/resolvers';
import { DgraphDataSource, RxNavDataSource } from './v1/types';

import { createApolloServer, createFastifyServer, FastifyConfig } from './server';
import { DgraphGqlDataSource } from './v1/types/DgraphGqlDataSource';

const start = async () => {
  let fastifyServer;

  try {
    const { typeDefs: typeDefsV1, resolvers: resolversV1 } = await buildTypeDefsAndResolvers({
      resolvers: [EntityResolver],
    });

    // TODO: add v2 schema.
    const { typeDefs: typeDefsV2, resolvers: resolversV2 } = await buildTypeDefsAndResolvers({
      resolvers: [EntityResolver],
    });

    const dataSourcesV1 = () => ({
      dgraph: new DgraphDataSource(),
      dgraphGql: new DgraphGqlDataSource(),
      rxnav: new RxNavDataSource(),
    });

    // TODO: add v2 data sources.
    const dataSourcesV2 = () => ({
      dgraph: new DgraphDataSource(),
      dgraphGql: new DgraphGqlDataSource(),
      rxnav: new RxNavDataSource(),
    });

    const apolloServer = await createApolloServer(typeDefsV1, resolversV1, dataSourcesV1);
    const apolloServerV1 = await createApolloServer(typeDefsV1, resolversV1, dataSourcesV1);
    const apolloServerV2 = await createApolloServer(typeDefsV2, resolversV2, dataSourcesV2);

    const apolloPlugin = apolloServer.createHandler({ path: '/graphql' });
    const apolloPluginV1 = apolloServerV1.createHandler({
      path: '/v1/graphql',
      disableHealthCheck: true,
    });
    const apolloPluginV2 = apolloServerV2.createHandler({
      path: '/v2/graphql',
      disableHealthCheck: true,
    });

    const fastifyConfig: FastifyConfig = { logger: true };
    const fastifyPlugins = [apolloPlugin, apolloPluginV1, apolloPluginV2, fastifyCors];

    fastifyServer = createFastifyServer(fastifyConfig, fastifyPlugins);

    await fastifyServer.listen(process.env.NX_DATA_SERVICE_PORT, '0.0.0.0');
  } catch (err) {
    console.log(err);
    if (fastifyServer) {
      fastifyServer.log.error(err);
    }
    process.exit(1);
  }
};

start();
