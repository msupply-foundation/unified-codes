import createLegacyApiServer from './api';
import { Server } from './types';

const start = async (): Promise<void> => {
  let server: Server;
  try {
    server = createLegacyApiServer({ logger: true });
    const port = parseInt(process.env.NX_LEGACY_API_PORT);
    await server.listen(port, '0.0.0.0');
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
