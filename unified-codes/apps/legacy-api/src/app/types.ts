import * as Http from 'http';
import * as Dgraph from 'dgraph-js-http';
import * as Fastify from 'fastify';
import * as Fluent from 'fluent-schema';

export type Server = Fastify.FastifyInstance<
  Http.Server,
  Http.IncomingMessage,
  Http.ServerResponse
>;
export type Options = Fastify.FastifyServerOptions;
export type Route = { path: string; opts: Fastify.RouteShorthandOptionsWithHandler };
export type Handler = Fastify.RouteHandler;
export type Query = Fastify.RequestQuerystringDefault;
export type Reply = Fastify.FastifyReply<Fastify.RawServerBase>;
export type Request = Fastify.FastifyRequest;
export type Schema = Fastify.FastifySchema & {
  response: {
    [code: number]: Fluent.JSONSchema;
    [code: string]: Fluent.JSONSchema;
  };
};
export type DgraphResponse = Dgraph.Response & { data: { query: [] } };
