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
    const port = parseInt(process.env.NX_DATA_SERVICE_PORT);
    await fastifyServer.listen(port, '0.0.0.0');
  } catch (err) {
    if (fastifyServer) {
      fastifyServer.log.error(err);
    }
    process.exit(1);
  }
};

start();
