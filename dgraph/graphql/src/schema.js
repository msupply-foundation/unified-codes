import { gql } from 'apollo-server-fastify';

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
    searchByName(text: String): [Entity]
    getDrugInteractions(rxCui: String): [DrugInteraction]
  }

  type DrugInteraction {
    name: String
    description: String
    severity: String
  }
`;

export { typeDefs };
