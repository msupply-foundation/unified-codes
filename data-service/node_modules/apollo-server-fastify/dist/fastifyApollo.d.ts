/// <reference types="node" />
import { GraphQLOptions } from 'apollo-server-core';
import { FastifyReply, FastifyRequest, RequestHandler } from 'fastify';
import { IncomingMessage, OutgoingMessage } from 'http';
import { ValueOrPromise } from 'apollo-server-types';
export declare function graphqlFastify(options: (req?: FastifyRequest<IncomingMessage>, res?: FastifyReply<OutgoingMessage>) => ValueOrPromise<GraphQLOptions>): Promise<RequestHandler<IncomingMessage, OutgoingMessage>>;
//# sourceMappingURL=fastifyApollo.d.ts.map