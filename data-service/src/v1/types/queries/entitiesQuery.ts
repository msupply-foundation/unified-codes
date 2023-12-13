import { gql } from 'graphql-request';

export const getEntitiesQuery = gql`
  query getEntities($search: String = "", $first: Int = 10, $offset: Int = 0) {
    queryEntity(
      filter: {
        or: { code: { alloftext: $search } }
        description: { allofterms: $search }
      }
      first: $first
      offset: $offset
    ) {
      code
      description
    }
  }
`;
