import * as Types from '@uc-frontend/common';

import { GraphQLClient } from 'graphql-request';
import * as Dom from 'graphql-request/dist/types.dom';
import gql from 'graphql-tag';
export type AddEntityTreeMutationVariables = Types.Exact<{
  input: Types.UpsertEntityInput;
}>;


export type AddEntityTreeMutation = { __typename?: 'FullMutation', upsertEntity: { __typename: 'EntityType', code: string } };

export type PendingChangeSummaryFragment = { __typename?: 'PendingChangeNode', name: string, category: string, changeType: Types.ChangeTypeNode, requestedBy: string, requestedFor: string, dateRequested: string, id: string };

export type PendingChangesQueryVariables = Types.Exact<{
  page?: Types.InputMaybe<Types.PaginationInput>;
  sort?: Types.InputMaybe<Array<Types.PendingChangeSortInput> | Types.PendingChangeSortInput>;
}>;


export type PendingChangesQuery = { __typename?: 'FullQuery', pendingChanges: { __typename?: 'PendingChangeConnector', totalCount: number, nodes: Array<{ __typename?: 'PendingChangeNode', name: string, category: string, changeType: Types.ChangeTypeNode, requestedBy: string, requestedFor: string, dateRequested: string, id: string }> } };

export const PendingChangeSummaryFragmentDoc = gql`
    fragment PendingChangeSummary on PendingChangeNode {
  id: requestId
  name
  category
  changeType
  requestedBy
  requestedFor
  dateRequested
}
    `;
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
export const PendingChangesDocument = gql`
    query pendingChanges($page: PaginationInput, $sort: [PendingChangeSortInput!]) {
  pendingChanges(page: $page, sort: $sort) {
    ... on PendingChangeConnector {
      totalCount
      nodes {
        ...PendingChangeSummary
      }
    }
  }
}
    ${PendingChangeSummaryFragmentDoc}`;

export type SdkFunctionWrapper = <T>(action: (requestHeaders?:Record<string, string>) => Promise<T>, operationName: string, operationType?: string) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = (action, _operationName, _operationType) => action();

export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    addEntityTree(variables: AddEntityTreeMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<AddEntityTreeMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<AddEntityTreeMutation>(AddEntityTreeDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'addEntityTree', 'mutation');
    },
    pendingChanges(variables?: PendingChangesQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<PendingChangesQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<PendingChangesQuery>(PendingChangesDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'pendingChanges', 'query');
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;