import createLegacyApiServer from './api';
import { Server } from './types';

const start = async (): Promise<void> => {
  let server: Server;
  try {
    server = createLegacyApiServer({ logger: true });
    await server.listen(3000);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
