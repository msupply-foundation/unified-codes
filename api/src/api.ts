import fastify, { FastifyInstance } from 'fastify';
import { Server, IncomingMessage, ServerResponse } from 'http';

import schemas from './schemas';
import handlers from './handlers';

const api: FastifyInstance<Server, IncomingMessage, ServerResponse> = fastify({ logger: true });

api.get('/health', { schema: schemas.health, handler: handlers.health });
api.get('/items', { schema: schemas.items, handler: handlers.items });
api.get('/version', { schema: schemas.version, handler: handlers.version });

export default api;
