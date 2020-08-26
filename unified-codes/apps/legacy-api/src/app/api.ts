import fastify from 'fastify';

import schemas from './schemas';
import handlers from './handlers';
import { Server, Route, Options } from './types';

export const createApiServer = (opts?: Options) => {
  const routes = [
    { path: '/health', opts: { schema: schemas.health, handler: handlers.health } },
    { path: '/items', opts: { schema: schemas.items, handler: handlers.items } },
    { path: '/version', opts: { schema: schemas.version, handler: handlers.version } },
  ];

  const server: Server = fastify(opts);
  routes.forEach((route: Route) => server.get(route.path, route.opts));

  return server;
};

export default createApiServer;
