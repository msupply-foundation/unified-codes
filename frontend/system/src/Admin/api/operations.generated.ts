import * as Types from '@uc-frontend/common';

import { GraphQLClient } from 'graphql-request';
import * as Dom from 'graphql-request/dist/types.dom';
import gql from 'graphql-tag';
export type AddEntityTreeMutationVariables = Types.Exact<{
  input: Types.UpsertEntityInput;
}>;


export type AddEntityTreeMutation = { __typename?: 'FullMutation', upsertEntity: { __typename: 'EntityType', code: string } };


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
    addEntityTree(variables: AddEntityTreeMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<AddEntityTreeMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<AddEntityTreeMutation>(AddEntityTreeDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'addEntityTree', 'mutation');
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;