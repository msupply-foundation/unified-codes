import fastifyCors from 'fastify-cors';

import { createApolloServer, createFastifyServer } from './server';

const start = async () => {
  let fastifyServer;
  try {
    const apolloServer = createApolloServer();
    const apolloPlugin = apolloServer.createHandler();
    const config = { logger: true };
    const plugins = [apolloPlugin, fastifyCors];
    fastifyServer = createFastifyServer(config, plugins);
    await fastifyServer.listen(4000);
  } catch (err) {
    if (fastifyServer) {
      fastifyServer.log.error(err);
    }
    process.exit(1);
  }
};

start();
