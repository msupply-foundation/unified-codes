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

  type User {
    familyName: String
    givenName: String
    isAuthenticated: Boolean!
    name: String!
    roles: [String]
  }

  type Query {
    "Request an entity by code"
    entity(code: String!): Entity
    "Request all entities with optional filter - Default behaviour: return all medicinal_products"
    entities(filter: SearchFilter): [Entity]
    "Request currently logged-in user"
    user: User
  }

  input SearchFilter {
    "Search by Level in Product Hierarchy"
    type: String
  }
`;

export { typeDefs };
