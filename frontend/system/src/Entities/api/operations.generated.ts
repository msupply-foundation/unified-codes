import * as Types from '@uc-frontend/common';

import { GraphQLClient } from 'graphql-request';
import * as Dom from 'graphql-request/dist/types.dom';
import gql from 'graphql-tag';
export type EntityRowFragment = { __typename?: 'EntityType', type: string, description: string, code: string, id: string };

export type EntityDetailsFragment = { __typename?: 'EntityType', code: string, name: string, type: string, properties: Array<{ __typename?: 'PropertiesType', type: string, value: string }> };

export type EntitiesQueryVariables = Types.Exact<{
  filter: Types.EntitySearchInput;
  first: Types.Scalars['Int']['input'];
  offset: Types.Scalars['Int']['input'];
}>;


export type EntitiesQuery = { __typename?: 'FullQuery', entities: { __typename?: 'EntityCollectionType', totalLength: number, data: Array<{ __typename?: 'EntityType', type: string, description: string, code: string, id: string }> } };

export type EntityQueryVariables = Types.Exact<{
  code: Types.Scalars['String']['input'];
}>;


export type EntityQuery = { __typename?: 'FullQuery', entity?: { __typename?: 'EntityType', code: string, name: string, type: string, children: Array<{ __typename?: 'EntityType', code: string, name: string, type: string, children: Array<{ __typename?: 'EntityType', code: string, name: string, type: string, children: Array<{ __typename?: 'EntityType', code: string, name: string, type: string, children: Array<{ __typename?: 'EntityType', code: string, name: string, type: string, children: Array<{ __typename?: 'EntityType', code: string, name: string, type: string, properties: Array<{ __typename?: 'PropertiesType', type: string, value: string }> }>, properties: Array<{ __typename?: 'PropertiesType', type: string, value: string }> }>, properties: Array<{ __typename?: 'PropertiesType', type: string, value: string }> }>, properties: Array<{ __typename?: 'PropertiesType', type: string, value: string }> }>, properties: Array<{ __typename?: 'PropertiesType', type: string, value: string }> }>, properties: Array<{ __typename?: 'PropertiesType', type: string, value: string }> } | null };

export type AddEntityTreeMutationVariables = Types.Exact<{
  input: Types.UpsertEntityInput;
}>;


export type AddEntityTreeMutation = { __typename?: 'FullMutation', upsertEntity: { __typename: 'EntityType', code: string } };

export const EntityRowFragmentDoc = gql`
    fragment EntityRow on EntityType {
  id: uid
  type
  description
  code
}
    `;
export const EntityDetailsFragmentDoc = gql`
    fragment EntityDetails on EntityType {
  code
  name
  type
  properties {
    type
    value
  }
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
export const EntityDocument = gql`
    query entity($code: String!) {
  entity(code: $code) {
    ...EntityDetails
    children {
      ...EntityDetails
      children {
        ...EntityDetails
        children {
          ...EntityDetails
          children {
            ...EntityDetails
            children {
              ...EntityDetails
            }
          }
        }
      }
    }
  }
}
    ${EntityDetailsFragmentDoc}`;
export const AddEntityTreeDocument = gql`
    mutation addEntityTree($input: UpsertEntityInput!) {
  upsertEntity(input: $input) {
    ... on EntityType {
      __typename
      code
    }
  }
}
    `;

export type SdkFunctionWrapper = <T>(action: (requestHeaders?:Record<string, string>) => Promise<T>, operationName: string, operationType?: string) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = (action, _operationName, _operationType) => action();

export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    entities(variables: EntitiesQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<EntitiesQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<EntitiesQuery>(EntitiesDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'entities', 'query');
    },
    entity(variables: EntityQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<EntityQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<EntityQuery>(EntityDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'entity', 'query');
    },
    addEntityTree(variables: AddEntityTreeMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<AddEntityTreeMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<AddEntityTreeMutation>(AddEntityTreeDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'addEntityTree', 'mutation');
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;