import { gql } from 'apollo-server-fastify';

const typeDefs = gql`
  scalar JSON
  
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
    entities(type: String): [Entity]
    getDrugInteractions(code: String!): JSON
  }
`;

export { typeDefs };
