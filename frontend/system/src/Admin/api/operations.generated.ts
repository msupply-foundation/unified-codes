import * as Types from '@uc-frontend/common';

import { GraphQLClient } from 'graphql-request';
import * as Dom from 'graphql-request/dist/types.dom';
import gql from 'graphql-tag';
export type ApprovePendingChangeMutationVariables = Types.Exact<{
  id?: Types.InputMaybe<Types.Scalars['String']['input']>;
  input: Types.UpsertEntityInput;
}>;


export type ApprovePendingChangeMutation = { __typename?: 'FullMutation', approvePendingChange: { __typename: 'EntityType', code: string } };

export type RejectPendingChangeMutationVariables = Types.Exact<{
  id?: Types.InputMaybe<Types.Scalars['String']['input']>;
}>;


export type RejectPendingChangeMutation = { __typename?: 'FullMutation', rejectPendingChange: { __typename?: 'IdResponse', id: string } };

export type PendingChangeSummaryFragment = { __typename?: 'PendingChangeNode', name: string, category: string, changeType: Types.ChangeTypeNode, requestedBy: string, dateRequested: string, id: string };

export type PendingChangesQueryVariables = Types.Exact<{
  page?: Types.InputMaybe<Types.PaginationInput>;
  sort?: Types.InputMaybe<Array<Types.PendingChangeSortInput> | Types.PendingChangeSortInput>;
}>;


export type PendingChangesQuery = { __typename?: 'FullQuery', pendingChanges: { __typename?: 'PendingChangeConnector', totalCount: number, nodes: Array<{ __typename?: 'PendingChangeNode', name: string, category: string, changeType: Types.ChangeTypeNode, requestedBy: string, dateRequested: string, id: string }> } };

export type PendingChangeDetailsFragment = { __typename?: 'PendingChangeNode', name: string, category: string, changeType: Types.ChangeTypeNode, requestedBy: string, dateRequested: string, body: string, id: string };

export type PendingChangeQueryVariables = Types.Exact<{
  id: Types.Scalars['String']['input'];
}>;


export type PendingChangeQuery = { __typename?: 'FullQuery', pendingChange?: { __typename?: 'PendingChangeNode', name: string, category: string, changeType: Types.ChangeTypeNode, requestedBy: string, dateRequested: string, body: string, id: string } | null };

export type RequestChangeMutationVariables = Types.Exact<{
  input: Types.RequestChangeInput;
}>;


export type RequestChangeMutation = { __typename?: 'FullMutation', requestChange: { __typename?: 'PendingChangeNode', requestId: string } };

export type UpdatePendingChangeMutationVariables = Types.Exact<{
  id: Types.Scalars['String']['input'];
  body: Types.Scalars['String']['input'];
}>;


export type UpdatePendingChangeMutation = { __typename?: 'FullMutation', updatePendingChange: { __typename?: 'PendingChangeNode', requestId: string } };

export const PendingChangeSummaryFragmentDoc = gql`
    fragment PendingChangeSummary on PendingChangeNode {
  id: requestId
  name
  category
  changeType
  requestedBy
  dateRequested
}
    `;
export const PendingChangeDetailsFragmentDoc = gql`
    fragment PendingChangeDetails on PendingChangeNode {
  id: requestId
  name
  category
  changeType
  requestedBy
  dateRequested
  body
}
    `;
export const ApprovePendingChangeDocument = gql`
    mutation approvePendingChange($id: String, $input: UpsertEntityInput!) {
  approvePendingChange(requestId: $id, input: $input) {
    ... on EntityType {
      __typename
      code
    }
  }
}
    `;
export const RejectPendingChangeDocument = gql`
    mutation rejectPendingChange($id: String) {
  rejectPendingChange(requestId: $id) {
    id
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
export const PendingChangeDocument = gql`
    query pendingChange($id: String!) {
  pendingChange(requestId: $id) {
    ... on PendingChangeNode {
      ...PendingChangeDetails
    }
  }
}
    ${PendingChangeDetailsFragmentDoc}`;
export const RequestChangeDocument = gql`
    mutation requestChange($input: RequestChangeInput!) {
  requestChange(input: $input) {
    ... on PendingChangeNode {
      requestId
    }
  }
}
    `;
export const UpdatePendingChangeDocument = gql`
    mutation updatePendingChange($id: String!, $body: String!) {
  updatePendingChange(requestId: $id, body: $body) {
    ... on PendingChangeNode {
      requestId
    }
  }
}
    `;

export type SdkFunctionWrapper = <T>(action: (requestHeaders?:Record<string, string>) => Promise<T>, operationName: string, operationType?: string) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = (action, _operationName, _operationType) => action();

export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    approvePendingChange(variables: ApprovePendingChangeMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<ApprovePendingChangeMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<ApprovePendingChangeMutation>(ApprovePendingChangeDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'approvePendingChange', 'mutation');
    },
    rejectPendingChange(variables?: RejectPendingChangeMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<RejectPendingChangeMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<RejectPendingChangeMutation>(RejectPendingChangeDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'rejectPendingChange', 'mutation');
    },
    pendingChanges(variables?: PendingChangesQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<PendingChangesQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<PendingChangesQuery>(PendingChangesDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'pendingChanges', 'query');
    },
    pendingChange(variables: PendingChangeQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<PendingChangeQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<PendingChangeQuery>(PendingChangeDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'pendingChange', 'query');
    },
    requestChange(variables: RequestChangeMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<RequestChangeMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<RequestChangeMutation>(RequestChangeDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'requestChange', 'mutation');
    },
    updatePendingChange(variables: UpdatePendingChangeMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<UpdatePendingChangeMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<UpdatePendingChangeMutation>(UpdatePendingChangeDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'updatePendingChange', 'mutation');
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;