import * as Types from '@uc-frontend/common';

import { GraphQLClient } from 'graphql-request';
import * as Dom from 'graphql-request/dist/types.dom';
import gql from 'graphql-tag';
export type InteractionGroupFragment = { __typename?: 'DrugInteractionGroupNode', id: string, name: string, description?: string | null, drugs: Array<{ __typename?: 'EntityType', code: string, description: string }> };

export type DrugInteractionGroupsQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type DrugInteractionGroupsQuery = { __typename?: 'FullQuery', allDrugInteractionGroups: { __typename?: 'DrugInteractionGroupConnector', totalCount: number, data: Array<{ __typename?: 'DrugInteractionGroupNode', id: string, name: string, description?: string | null, drugs: Array<{ __typename?: 'EntityType', code: string, description: string }> }> } };

export type UpsertDrugInteractionGroupMutationVariables = Types.Exact<{
  input: Types.UpsertDrugInteractionGroupInput;
}>;


export type UpsertDrugInteractionGroupMutation = { __typename?: 'FullMutation', upsertDrugInteractionGroup: number };

export type DeleteDrugInteractionGroupMutationVariables = Types.Exact<{
  id: Types.Scalars['String']['input'];
}>;


export type DeleteDrugInteractionGroupMutation = { __typename?: 'FullMutation', deleteDrugInteractionGroup: number };

export const InteractionGroupFragmentDoc = gql`
    fragment InteractionGroup on DrugInteractionGroupNode {
  id
  name
  description
  drugs {
    code
    description
  }
}
    `;
export const DrugInteractionGroupsDocument = gql`
    query DrugInteractionGroups {
  allDrugInteractionGroups {
    ... on DrugInteractionGroupConnector {
      data {
        ...InteractionGroup
      }
      totalCount
    }
  }
}
    ${InteractionGroupFragmentDoc}`;
export const UpsertDrugInteractionGroupDocument = gql`
    mutation UpsertDrugInteractionGroup($input: UpsertDrugInteractionGroupInput!) {
  upsertDrugInteractionGroup(input: $input)
}
    `;
export const DeleteDrugInteractionGroupDocument = gql`
    mutation DeleteDrugInteractionGroup($id: String!) {
  deleteDrugInteractionGroup(code: $id)
}
    `;

export type SdkFunctionWrapper = <T>(action: (requestHeaders?:Record<string, string>) => Promise<T>, operationName: string, operationType?: string) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = (action, _operationName, _operationType) => action();

export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    DrugInteractionGroups(variables?: DrugInteractionGroupsQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<DrugInteractionGroupsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<DrugInteractionGroupsQuery>(DrugInteractionGroupsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'DrugInteractionGroups', 'query');
    },
    UpsertDrugInteractionGroup(variables: UpsertDrugInteractionGroupMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<UpsertDrugInteractionGroupMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<UpsertDrugInteractionGroupMutation>(UpsertDrugInteractionGroupDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'UpsertDrugInteractionGroup', 'mutation');
    },
    DeleteDrugInteractionGroup(variables: DeleteDrugInteractionGroupMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<DeleteDrugInteractionGroupMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<DeleteDrugInteractionGroupMutation>(DeleteDrugInteractionGroupDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'DeleteDrugInteractionGroup', 'mutation');
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;