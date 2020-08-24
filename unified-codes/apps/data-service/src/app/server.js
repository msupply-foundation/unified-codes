import { createApolloServer, createFastifyServer } from './api';

const start = async () => {
  let fastifyServer;
  try {
    fastifyServer = createFastifyServer(createApolloServer());
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
