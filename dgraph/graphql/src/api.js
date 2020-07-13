import { ApolloServer, gql } from 'apollo-server-fastify';
import fastify from 'fastify';

const typeDefs = gql`
  type Entity {
      type: String! 
      code: String
      description: String!
      properties: [Property] 
      children: [Entity]
  }

  type Property {
      type: String! 
      value: String! 
      properties: [Property]
  }

  type Query {
    search: [Entity]
  },
`;

const resolvers = {
  Query: {
    search: () => {
      return [
        { code: 'ABC', description: 'test1' },
        { code: 'DEF', description: 'test2' }
      ]
    }
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers
});

const graphApi = fastify({ logger: true });
graphApi.register(server.createHandler());

export default graphApi;