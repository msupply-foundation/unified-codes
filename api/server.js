const fastify = require('fastify')(
  { logger: true }
);

const schemas = require('./schemas');
const handlers = require('./handlers');

fastify.get('/health', { schema: schemas.health, handler: handlers.health });
fastify.get('/items', { schema: schemas.items, handler: handlers.items });
fastify.get('/version', { schema: schemas.version, handler: handlers.version });

const start = async () => {
  try {
    await fastify.listen(3000)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()