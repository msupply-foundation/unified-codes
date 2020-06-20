import fastify from "fastify";

import schemas from "./schemas";
import handlers from "./handlers";

const server = fastify({ logger: true });

server.get("/health", { schema: schemas.health, handler: handlers.health });
server.get("/items", { schema: schemas.items, handler: handlers.items });
server.get("/version", { schema: schemas.version, handler: handlers.version });

const start = async () => {
  try {
    await server.listen(3000);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
