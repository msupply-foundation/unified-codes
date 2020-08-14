import { createApolloServer, createFastifyServer } from './api';

const start = async () => {
  let fastifyServer;
  try {
    fastifyServer = createFastifyServer(createApolloServer());
    await fastifyServer.listen(4000);
  } catch (err) {
    if (fastifyServer) {
      fastifyServer.log.error(err);
    }
    process.exit(1);
  }
};

start();
