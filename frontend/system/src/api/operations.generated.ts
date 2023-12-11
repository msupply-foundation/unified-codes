import * as Types from '@uc-frontend/common';

import { GraphQLClient } from 'graphql-request';
import * as Dom from 'graphql-request/dist/types.dom';
import gql from 'graphql-tag';
export type EntityRowFragment = { __typename: 'EntityType', type: string, description?: string | null, code: string, id: string };

export type EntitiesQueryVariables = Types.Exact<{
  filter: Types.EntitySearchInput;
  first: Types.Scalars['Int']['input'];
  offset: Types.Scalars['Int']['input'];
}>;


export type EntitiesQuery = { __typename: 'Query', entities: { __typename: 'EntityCollectionType', totalLength: number, data: Array<{ __typename: 'EntityType', type: string, description?: string | null, code: string, id: string }> } };

export const EntityRowFragmentDoc = gql`
    fragment EntityRow on EntityType {
  id: uid
  type
  description
  code
}
    `;
export const EntitiesDocument = gql`
    query entities($filter: EntitySearchInput!, $first: Int!, $offset: Int!) {
  entities(filter: $filter, first: $first, offset: $offset) {
    totalLength
    data {
      ...EntityRow
    }
  }
}
    ${EntityRowFragmentDoc}`;

export type SdkFunctionWrapper = <T>(action: (requestHeaders?:Record<string, string>) => Promise<T>, operationName: string, operationType?: string) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = (action, _operationName, _operationType) => action();

export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    entities(variables: EntitiesQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<EntitiesQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<EntitiesQuery>(EntitiesDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'entities', 'query');
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;