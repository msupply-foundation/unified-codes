/// <reference types="node" />
import { ApolloServerBase } from 'apollo-server-core';
import { FastifyInstance, FastifyRequest } from 'fastify';
import { IncomingMessage, ServerResponse, Server } from 'http';
export interface ServerRegistration {
    path?: string;
    cors?: object | boolean;
    onHealthCheck?: (req: FastifyRequest<IncomingMessage>) => Promise<any>;
    disableHealthCheck?: boolean;
}
export declare class ApolloServer extends ApolloServerBase {
    protected supportsSubscriptions(): boolean;
    protected supportsUploads(): boolean;
    createHandler({ path, cors, disableHealthCheck, onHealthCheck, }?: ServerRegistration): (app: FastifyInstance<Server, IncomingMessage, ServerResponse>) => Promise<void>;
}
//# sourceMappingURL=ApolloServer.d.ts.map