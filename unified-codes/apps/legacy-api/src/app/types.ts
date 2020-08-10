import Dgraph from 'dgraph-js-http';
import * as Fastify from 'fastify';
import Http from 'http';
import { JSONSchema } from 'fluent-schema';

export type Api = Fastify.FastifyInstance<Http.Server, Http.IncomingMessage, Http.ServerResponse>;
export type Handler = Fastify.RouteHandler;
export type Query = Fastify.RequestQuerystringDefault;
export type Reply = Fastify.FastifyReply<Fastify.RawServerBase>;
export type Request = Fastify.FastifyRequest;
export type Schema = Fastify.FastifySchema & {
  response: {
    [code: number]: JSONSchema;
    [code: string]: JSONSchema;
  };
};
export type DgraphResponse = Dgraph.Response & { data: { query: [] } };
