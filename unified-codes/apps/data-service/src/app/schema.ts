import { gql } from 'apollo-server-fastify';

const typeDefs = gql`
  type Entity {
    code: String
    description: String!
    type: String!
    uid: String!
    has_child: [Entity]
    has_property: [Property]
  }

  type Property {
    type: String!
    value: String!
    has_property: [Property]
  }

  type Query {
    "Request an entity by code"
    entity(code: String!): Entity
    "Request all entities with optional filter - Default behaviour: return all medicinal_products"
    entities(filter: SearchFilter, first: Int, offset: Int): IEntityCollection
  }

  type IEntityCollection {
    data: [Entity]!
    first: Int!
    offset: Int!
    totalLength: Int!
  }

  input SearchFilter {
    "Search by entity code"
    code: String
    "Search by entity description"
    description: String
    "Search by Level in Product Hierarchy"
    type: String
    "Field to order by"
    orderBy: String
    "Sort ascending"
    orderDesc: Boolean
  }
`;

export { typeDefs };
