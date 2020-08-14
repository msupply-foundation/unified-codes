import { createApolloServer, createFastifyServer } from './api';

const start = async () => {
  try {
    const fastifyServer = createFastifyServer(createApolloServer());
    await fastifyServer.listen(4000);
  } catch (err) {
    graphApi.log.error(err);
    process.exit(1);
  }
};

start();
