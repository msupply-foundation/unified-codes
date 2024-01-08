import * as Types from '@uc-frontend/common';

import { GraphQLClient } from 'graphql-request';
import * as Dom from 'graphql-request/dist/types.dom';
import gql from 'graphql-tag';
export type UserAccountRowFragment = { __typename: 'UserAccountNode', id: string, username: string, email?: string | null, displayName: string, permissions: Array<Types.PermissionNode> };

export type UserAccountsQueryVariables = Types.Exact<{
  filter?: Types.InputMaybe<Types.UserAccountFilterInput>;
  page?: Types.InputMaybe<Types.PaginationInput>;
  sort?: Types.InputMaybe<Array<Types.UserAccountSortInput> | Types.UserAccountSortInput>;
}>;


export type UserAccountsQuery = { __typename?: 'FullQuery', userAccounts: { __typename: 'UserAccountConnector', totalCount: number, nodes: Array<{ __typename: 'UserAccountNode', id: string, username: string, email?: string | null, displayName: string, permissions: Array<Types.PermissionNode> }> } };

export type CreateUserAccountMutationVariables = Types.Exact<{
  input: Types.CreateUserAccountInput;
}>;


export type CreateUserAccountMutation = { __typename?: 'FullMutation', createUserAccount: { __typename: 'UserAccountNode', id: string, username: string, email?: string | null, displayName: string, permissions: Array<Types.PermissionNode> } };

export type InviteUserMutationVariables = Types.Exact<{
  input: Types.InviteUserInput;
}>;


export type InviteUserMutation = { __typename?: 'FullMutation', initiateUserInvite: { __typename?: 'InviteUserResponseMessage', message: string } };

export type UpdateUserAccountMutationVariables = Types.Exact<{
  input: Types.UpdateUserAccountInput;
}>;


export type UpdateUserAccountMutation = { __typename?: 'FullMutation', updateUserAccount: { __typename: 'UserAccountNode', id: string, username: string, email?: string | null, displayName: string, permissions: Array<Types.PermissionNode> } };

export type DeleteUserAccountMutationVariables = Types.Exact<{
  input: Types.Scalars['String']['input'];
}>;


export type DeleteUserAccountMutation = { __typename?: 'FullMutation', deleteUserAccount: { __typename?: 'DeleteResponse', id: string } };

export type AcceptUserInviteMutationVariables = Types.Exact<{
  input: Types.AcceptUserInviteInput;
  token: Types.Scalars['String']['input'];
}>;


export type AcceptUserInviteMutation = { __typename?: 'FullMutation', acceptUserInvite: { __typename?: 'InviteUserResponseMessage', message: string } };

export const UserAccountRowFragmentDoc = gql`
    fragment UserAccountRow on UserAccountNode {
  __typename
  id
  username
  email
  displayName
  permissions
}
    `;
export const UserAccountsDocument = gql`
    query UserAccounts($filter: UserAccountFilterInput, $page: PaginationInput, $sort: [UserAccountSortInput!]) {
  userAccounts(filter: $filter, page: $page, sort: $sort) {
    __typename
    ... on UserAccountConnector {
      __typename
      totalCount
      nodes {
        ...UserAccountRow
      }
    }
  }
}
    ${UserAccountRowFragmentDoc}`;
export const CreateUserAccountDocument = gql`
    mutation createUserAccount($input: CreateUserAccountInput!) {
  createUserAccount(input: $input) {
    ... on UserAccountNode {
      ...UserAccountRow
    }
  }
}
    ${UserAccountRowFragmentDoc}`;
export const InviteUserDocument = gql`
    mutation inviteUser($input: InviteUserInput!) {
  initiateUserInvite(input: $input) {
    ... on InviteUserResponseMessage {
      message
    }
  }
}
    `;
export const UpdateUserAccountDocument = gql`
    mutation updateUserAccount($input: UpdateUserAccountInput!) {
  updateUserAccount(input: $input) {
    ... on UserAccountNode {
      ...UserAccountRow
    }
  }
}
    ${UserAccountRowFragmentDoc}`;
export const DeleteUserAccountDocument = gql`
    mutation deleteUserAccount($input: String!) {
  deleteUserAccount(userAccountId: $input) {
    ... on DeleteResponse {
      id
    }
  }
}
    `;
export const AcceptUserInviteDocument = gql`
    mutation acceptUserInvite($input: AcceptUserInviteInput!, $token: String!) {
  acceptUserInvite(input: $input, token: $token) {
    ... on InviteUserResponseMessage {
      message
    }
  }
}
    `;

export type SdkFunctionWrapper = <T>(action: (requestHeaders?:Record<string, string>) => Promise<T>, operationName: string, operationType?: string) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = (action, _operationName, _operationType) => action();

export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    UserAccounts(variables?: UserAccountsQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<UserAccountsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<UserAccountsQuery>(UserAccountsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'UserAccounts', 'query');
    },
    createUserAccount(variables: CreateUserAccountMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<CreateUserAccountMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CreateUserAccountMutation>(CreateUserAccountDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'createUserAccount', 'mutation');
    },
    inviteUser(variables: InviteUserMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<InviteUserMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<InviteUserMutation>(InviteUserDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'inviteUser', 'mutation');
    },
    updateUserAccount(variables: UpdateUserAccountMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<UpdateUserAccountMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<UpdateUserAccountMutation>(UpdateUserAccountDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'updateUserAccount', 'mutation');
    },
    deleteUserAccount(variables: DeleteUserAccountMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<DeleteUserAccountMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<DeleteUserAccountMutation>(DeleteUserAccountDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'deleteUserAccount', 'mutation');
    },
    acceptUserInvite(variables: AcceptUserInviteMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<AcceptUserInviteMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<AcceptUserInviteMutation>(AcceptUserInviteDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'acceptUserInvite', 'mutation');
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;