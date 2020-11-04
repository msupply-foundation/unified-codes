import 'reflect-metadata';

import fastifyCors from 'fastify-cors';
import { buildTypeDefsAndResolvers } from 'type-graphql';

import { DgraphDataSource, RxNavDataSource } from './types';
import { EntityResolver } from './resolvers';
import { createApolloServer, createFastifyServer } from './server';
import { gql } from 'apollo-server-fastify';

const start = async () => {
  let fastifyServer;

  try {
    const { resolvers } = await buildTypeDefsAndResolvers({
      resolvers: [EntityResolver],
    });
    const typeDefs = gql`
      directive @severity(severity: String) on FIELD_DEFINITION | FIELD
      type Query {
        entity(code: String!): EntityType!
        entities(filter: EntitySearchInput!, first: Int!, offset: Int!): EntityCollectionType!
      }

      type EntityType {
        children: [EntityType!]
        code: String!
        description: String
        interactions: [DrugInteractionType!] @severity(severity: "high")
        properties: [PropertyType!]
        type: String!
        uid: ID!
      }

      type DrugInteractionType {
        description: String!
        name: String!
        rxcui: String!
        severity: String!
        source: String!
      }

      type PropertyType {
        properties: [PropertyType!]
        type: String!
        value: String!
      }

      type EntityCollectionType {
        data: [EntityType!]!
        totalLength: Int!
      }

      input EntitySearchInput {
        code: String
        description: String
        orderBy: EntitySortInput
        type: String
        match: String
      }

      input EntitySortInput {
        """
        Defaults to ascending search if not specified
        """
        descending: Boolean

        """
        Defaults to search on description if not specified
        """
        field: String
      }
    `;
    // console.info('typedefs', typeDefs);

    const dataSources = () => ({
      dgraph: new DgraphDataSource(),
      rxnav: new RxNavDataSource(),
    });

    const apolloServer = await createApolloServer(typeDefs, resolvers, dataSources);
    const apolloPlugin = apolloServer.createHandler();
    const config = { logger: true };
    const plugins = [apolloPlugin, fastifyCors];

    fastifyServer = createFastifyServer(config, plugins);

    await fastifyServer.listen(process.env.NX_DATA_SERVICE_PORT, '0.0.0.0');
  } catch (err) {
    console.log(err);
    if (fastifyServer) {
      fastifyServer.log.error(err);
    }
    process.exit(1);
  }
};

start();
