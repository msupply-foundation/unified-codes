import { gql } from 'apollo-server-fastify';

const typeDefs = gql`
  type Entity {
    code: String
    description: String!
    type: String!
    uid: String!
    interactions: [DrugInteraction]
    children: [Entity]
    properties: [Property]
  }

  type Property {
    type: String!
    value: String!
    properties: [Property]
  }

  type DrugInteraction {
    name: String
    description: String
    severity: String
    source: String
    rxcui: String
  }

  type Query {
    "Request an entity by code"
    entity(code: String!): Entity
    "Request all entities with optional filter - Default behaviour: return all medicinal_products"
    entities(filter: EntityFilterInput, first: Int, offset: Int): EntityCollection
  }

  type Mutation {
    deleteEntity(code: String!): DeleteMutationResponse
  }

  type DeleteMutationResponse implements MutationResponse {
    success: Boolean!
  }

  interface MutationResponse {
    success: Boolean!
  }

  type EntityCollection {
    data: [Entity]!
    totalLength: Int!
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
