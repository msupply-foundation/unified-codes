import * as Types from '@uc-frontend/common';

import { GraphQLClient } from 'graphql-request';
import * as Dom from 'graphql-request/dist/types.dom';
import gql from 'graphql-tag';
export type InitiatePasswordResetMutationVariables = Types.Exact<{
  emailOrUserId: Types.Scalars['String']['input'];
}>;

export type InitiatePasswordResetMutation = {
  __typename: 'FullMutation';
  initiatePasswordReset: {
    __typename: 'PasswordResetResponseMessage';
    message: string;
  };
};

export type ValidatePasswordResetTokenMutationVariables = Types.Exact<{
  token: Types.Scalars['String']['input'];
}>;

export type ValidatePasswordResetTokenMutation = {
  __typename: 'FullMutation';
  validatePasswordResetToken: {
    __typename: 'PasswordResetResponseMessage';
    message: string;
  };
};

export type ResetPasswordUsingTokenMutationVariables = Types.Exact<{
  token: Types.Scalars['String']['input'];
  password: Types.Scalars['String']['input'];
}>;

export type ResetPasswordUsingTokenMutation = {
  __typename: 'FullMutation';
  resetPasswordUsingToken: {
    __typename: 'PasswordResetResponseMessage';
    message: string;
  };
};

export const InitiatePasswordResetDocument = gql`
  mutation initiatePasswordReset($emailOrUserId: String!) {
    initiatePasswordReset(email: $emailOrUserId) {
      ... on PasswordResetResponseMessage {
        __typename
        message
      }
    }
  }
`;
export const ValidatePasswordResetTokenDocument = gql`
  mutation validatePasswordResetToken($token: String!) {
    validatePasswordResetToken(token: $token) {
      ... on PasswordResetResponseMessage {
        message
      }
    }
  }
`;
export const ResetPasswordUsingTokenDocument = gql`
  mutation resetPasswordUsingToken($token: String!, $password: String!) {
    resetPasswordUsingToken(token: $token, password: $password) {
      ... on PasswordResetResponseMessage {
        __typename
        message
      }
    }
  }
`;

export type SdkFunctionWrapper = <T>(
  action: (requestHeaders?: Record<string, string>) => Promise<T>,
  operationName: string,
  operationType?: string
) => Promise<T>;

const defaultWrapper: SdkFunctionWrapper = (
  action,
  _operationName,
  _operationType
) => action();

export function getSdk(
  client: GraphQLClient,
  withWrapper: SdkFunctionWrapper = defaultWrapper
) {
  return {
    initiatePasswordReset(
      variables: InitiatePasswordResetMutationVariables,
      requestHeaders?: Dom.RequestInit['headers']
    ): Promise<InitiatePasswordResetMutation> {
      return withWrapper(
        wrappedRequestHeaders =>
          client.request<InitiatePasswordResetMutation>(
            InitiatePasswordResetDocument,
            variables,
            { ...requestHeaders, ...wrappedRequestHeaders }
          ),
        'initiatePasswordReset',
        'mutation'
      );
    },
    validatePasswordResetToken(
      variables: ValidatePasswordResetTokenMutationVariables,
      requestHeaders?: Dom.RequestInit['headers']
    ): Promise<ValidatePasswordResetTokenMutation> {
      return withWrapper(
        wrappedRequestHeaders =>
          client.request<ValidatePasswordResetTokenMutation>(
            ValidatePasswordResetTokenDocument,
            variables,
            { ...requestHeaders, ...wrappedRequestHeaders }
          ),
        'validatePasswordResetToken',
        'mutation'
      );
    },
    resetPasswordUsingToken(
      variables: ResetPasswordUsingTokenMutationVariables,
      requestHeaders?: Dom.RequestInit['headers']
    ): Promise<ResetPasswordUsingTokenMutation> {
      return withWrapper(
        wrappedRequestHeaders =>
          client.request<ResetPasswordUsingTokenMutation>(
            ResetPasswordUsingTokenDocument,
            variables,
            { ...requestHeaders, ...wrappedRequestHeaders }
          ),
        'resetPasswordUsingToken',
        'mutation'
      );
    },
  };
}
export type Sdk = ReturnType<typeof getSdk>;
