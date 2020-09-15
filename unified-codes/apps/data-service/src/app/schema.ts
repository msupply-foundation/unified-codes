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
    "Request an entity by code"
    entity(code: String!): Entity
    "Request all entities with optional filter - Default behaviour: return all medicinal_products"
    entities(filter: EntityFilterInput, first: Int, offset: Int): EntitiesResponse
  }

  type EntitiesResponse {
    data: [Entity]!
    hasMore: Boolean!
    totalResults: Int!
  }

  input EntityFilterInput {
    "Search by entity code"
    code: String
    "Search by entity description"
    description: String
    "Order search results"
    orderBy: EntitySortInput
    "Search by Level in Product Hierarchy"
    type: String
  }

  input EntitySortInput {
    "Field to order by"
    field: String
    "Sort ascending"
    descending: Boolean
  }
`;

export { typeDefs };
