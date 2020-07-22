import { gql } from 'apollo-server-fastify';

const typeDefs = gql`
 
  type Entity {
    type: String!
    code: String
    description: String!
    has_property: [Property]
    has_child: [Entity]
  }

  type Property {
    type: String!
    value: String!
    has_property: [Property]
  }

  type Query {
    entities (filter: SearchFilter): [Entity]
  }

  input SearchFilter {
    code: String
    type: String
  }
`;

export { typeDefs };
