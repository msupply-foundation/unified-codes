import * as Types from '@uc-frontend/common';

import { GraphQLClient } from 'graphql-request';
import * as Dom from 'graphql-request/dist/types.dom';
import gql from 'graphql-tag';
export type InteractionGroupFragment = { __typename?: 'DrugInteractionGroupNode', id: string, name: string, description?: string | null, drugs: Array<{ __typename?: 'EntityType', code: string, description: string }> };

export type DrugInteractionGroupsQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type DrugInteractionGroupsQuery = { __typename?: 'FullQuery', allDrugInteractionGroups: { __typename?: 'DrugInteractionGroupConnector', totalCount: number, data: Array<{ __typename?: 'DrugInteractionGroupNode', id: string, name: string, description?: string | null, drugs: Array<{ __typename?: 'EntityType', code: string, description: string }> }> } };

export type AddDrugInteractionGroupMutationVariables = Types.Exact<{
  input: Types.AddDrugInteractionGroupInput;
}>;


export type AddDrugInteractionGroupMutation = { __typename?: 'FullMutation', addDrugInteractionGroup: number };

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
export const AddDrugInteractionGroupDocument = gql`
    mutation AddDrugInteractionGroup($input: AddDrugInteractionGroupInput!) {
  addDrugInteractionGroup(input: $input)
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
    AddDrugInteractionGroup(variables: AddDrugInteractionGroupMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<AddDrugInteractionGroupMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<AddDrugInteractionGroupMutation>(AddDrugInteractionGroupDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'AddDrugInteractionGroup', 'mutation');
    },
    DeleteDrugInteractionGroup(variables: DeleteDrugInteractionGroupMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<DeleteDrugInteractionGroupMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<DeleteDrugInteractionGroupMutation>(DeleteDrugInteractionGroupDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'DeleteDrugInteractionGroup', 'mutation');
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;