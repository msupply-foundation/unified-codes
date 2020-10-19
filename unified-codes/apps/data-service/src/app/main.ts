import 'reflect-metadata';

import fastifyCors from 'fastify-cors';
import { buildTypeDefsAndResolvers } from 'type-graphql';

import { DgraphDataSource, RxNavDataSource } from './types';
import { EntityResolver } from './resolvers';
import { createApolloServer, createFastifyServer } from './server';

const start = async () => {
  let fastifyServer;

  try {
    const { typeDefs, resolvers } = await buildTypeDefsAndResolvers({
      resolvers: [EntityResolver],
    });

    const dataSources = () => ({
      dgraph: new DgraphDataSource(),
      rxnav: new RxNavDataSource(),
    });

    const apolloServer = await createApolloServer(typeDefs, resolvers, dataSources);
    const apolloPlugin = apolloServer.createHandler();
    const config = { logger: true };
    const plugins = [apolloPlugin, fastifyCors];

    fastifyServer = createFastifyServer(config, plugins);

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
