import * as Types from '@uc-frontend/common';

import { GraphQLClient } from 'graphql-request';
import * as Dom from 'graphql-request/dist/types.dom';
import gql from 'graphql-tag';
export type InteractionGroupFragment = { __typename?: 'DrugInteractionGroupNode', id: string, name: string, description?: string | null, drugs: Array<{ __typename?: 'EntityType', code: string, description: string }> };

export type DrugInteractionGroupsQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type DrugInteractionGroupsQuery = { __typename?: 'FullQuery', allDrugInteractionGroups: { __typename?: 'DrugInteractionGroupConnector', totalCount: number, data: Array<{ __typename?: 'DrugInteractionGroupNode', id: string, name: string, description?: string | null, drugs: Array<{ __typename?: 'EntityType', code: string, description: string }> }> } };

export type DrugInteractionFragment = { __typename?: 'DrugInteractionNode', id: string, name: string, description?: string | null, severity: Types.DrugInteractionSeverityNode, action?: string | null, reference?: string | null, drug1?: { __typename?: 'EntityType', code: string, description: string } | null, drug2?: { __typename?: 'EntityType', code: string, description: string } | null, group1?: { __typename?: 'DrugInteractionGroupNode', id: string, name: string } | null, group2?: { __typename?: 'DrugInteractionGroupNode', id: string, name: string } | null };

export type DrugInteractionsQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type DrugInteractionsQuery = { __typename?: 'FullQuery', allDrugInteractions: { __typename?: 'DrugInteractionConnector', totalCount: number, data: Array<{ __typename?: 'DrugInteractionNode', id: string, name: string, description?: string | null, severity: Types.DrugInteractionSeverityNode, action?: string | null, reference?: string | null, drug1?: { __typename?: 'EntityType', code: string, description: string } | null, drug2?: { __typename?: 'EntityType', code: string, description: string } | null, group1?: { __typename?: 'DrugInteractionGroupNode', id: string, name: string } | null, group2?: { __typename?: 'DrugInteractionGroupNode', id: string, name: string } | null }> } };

export type UpsertDrugInteractionGroupMutationVariables = Types.Exact<{
  input: Types.UpsertDrugInteractionGroupInput;
}>;


export type UpsertDrugInteractionGroupMutation = { __typename?: 'FullMutation', upsertDrugInteractionGroup: number };

export type DeleteDrugInteractionGroupMutationVariables = Types.Exact<{
  id: Types.Scalars['String']['input'];
}>;


export type DeleteDrugInteractionGroupMutation = { __typename?: 'FullMutation', deleteDrugInteractionGroup: number };

export type UpsertDrugInteractionMutationVariables = Types.Exact<{
  input: Types.UpsertDrugInteractionInput;
}>;


export type UpsertDrugInteractionMutation = { __typename?: 'FullMutation', upsertDrugInteraction: number };

export type DeleteDrugInteractionMutationVariables = Types.Exact<{
  id: Types.Scalars['String']['input'];
}>;


export type DeleteDrugInteractionMutation = { __typename?: 'FullMutation', deleteDrugInteraction: number };

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
export const DrugInteractionFragmentDoc = gql`
    fragment DrugInteraction on DrugInteractionNode {
  id
  name
  description
  severity
  action
  reference
  drug1 {
    code
    description
  }
  drug2 {
    code
    description
  }
  group1 {
    id
    name
  }
  group2 {
    id
    name
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
export const DrugInteractionsDocument = gql`
    query DrugInteractions {
  allDrugInteractions {
    ... on DrugInteractionConnector {
      data {
        ...DrugInteraction
      }
      totalCount
    }
  }
}
    ${DrugInteractionFragmentDoc}`;
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
export const UpsertDrugInteractionDocument = gql`
    mutation UpsertDrugInteraction($input: UpsertDrugInteractionInput!) {
  upsertDrugInteraction(input: $input)
}
    `;
export const DeleteDrugInteractionDocument = gql`
    mutation DeleteDrugInteraction($id: String!) {
  deleteDrugInteraction(code: $id)
}
    `;

export type SdkFunctionWrapper = <T>(action: (requestHeaders?:Record<string, string>) => Promise<T>, operationName: string, operationType?: string) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = (action, _operationName, _operationType) => action();

export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    DrugInteractionGroups(variables?: DrugInteractionGroupsQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<DrugInteractionGroupsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<DrugInteractionGroupsQuery>(DrugInteractionGroupsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'DrugInteractionGroups', 'query');
    },
    DrugInteractions(variables?: DrugInteractionsQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<DrugInteractionsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<DrugInteractionsQuery>(DrugInteractionsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'DrugInteractions', 'query');
    },
    UpsertDrugInteractionGroup(variables: UpsertDrugInteractionGroupMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<UpsertDrugInteractionGroupMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<UpsertDrugInteractionGroupMutation>(UpsertDrugInteractionGroupDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'UpsertDrugInteractionGroup', 'mutation');
    },
    DeleteDrugInteractionGroup(variables: DeleteDrugInteractionGroupMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<DeleteDrugInteractionGroupMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<DeleteDrugInteractionGroupMutation>(DeleteDrugInteractionGroupDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'DeleteDrugInteractionGroup', 'mutation');
    },
    UpsertDrugInteraction(variables: UpsertDrugInteractionMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<UpsertDrugInteractionMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<UpsertDrugInteractionMutation>(UpsertDrugInteractionDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'UpsertDrugInteraction', 'mutation');
    },
    DeleteDrugInteraction(variables: DeleteDrugInteractionMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<DeleteDrugInteractionMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<DeleteDrugInteractionMutation>(DeleteDrugInteractionDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'DeleteDrugInteraction', 'mutation');
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;