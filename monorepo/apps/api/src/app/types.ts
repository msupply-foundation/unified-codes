import Dgraph from 'dgraph-js-http';
import Fastify from 'fastify';
import Http from 'http';

export type Api = Fastify.FastifyInstance<Http.Server, Http.IncomingMessage, Http.ServerResponse>;
export type Handler = Fastify.RequestHandler;
export type Query = Fastify.DefaultQuery;
export type Reply = Fastify.FastifyReply<Http.ServerResponse>;
export type Request = Fastify.FastifyRequest;
export type Schema = Fastify.RouteSchema & {
  response: {
    [code: number]: Fastify.JSONSchema;
    [code: string]: Fastify.JSONSchema;
  };
};
export type DgraphResponse = Dgraph.Response & { data: { query: [] } };
