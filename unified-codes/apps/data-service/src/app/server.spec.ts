/* eslint-disable no-undef */
import nock from 'nock';

import 'reflect-metadata';

import fastifyCors from 'fastify-cors';
import { buildTypeDefsAndResolvers } from 'type-graphql';

import { EntityResolver } from './v1/resolvers';
import { DgraphDataSource, RxNavDataSource } from './v1/types';

import { createApolloServer, createFastifyServer, FastifyConfig } from './server';

let server;

const initialiseServer = async () => {
  const { typeDefs, resolvers } = await buildTypeDefsAndResolvers({
    resolvers: [EntityResolver],
  });

  const dataSources = () => ({
    dgraph: new DgraphDataSource(),
    rxnav: new RxNavDataSource(),
  });

  const apolloServer = await createApolloServer(typeDefs, resolvers, dataSources);

  const apolloPlugin = apolloServer.createHandler({ path: '/graphql' });

  const fastifyConfig: FastifyConfig = { logger: true };
  const fastifyPlugins = [apolloPlugin, fastifyCors];

  server = createFastifyServer(fastifyConfig, fastifyPlugins);
};

beforeAll(() => {
  return initialiseServer();
});

describe('Test entity resolver', () => {
  test('Response has status code 200 correctly formatted entity query', async (done) => {
    server
      .inject({
        method: 'POST',
        url: '/graphql',
        payload: {
          query: `{
            entity (code: "foobar") {
              code
              description
              type
              properties {
                type
                value
              }
            }
          }`,
        },
      })
      .then((response) => {
        const { statusCode } = response;
        expect(statusCode).toBe(200);
        done();
      });
  });
});
