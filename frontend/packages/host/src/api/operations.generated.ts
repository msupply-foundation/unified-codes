import * as Types from '@uc-frontend/common';

import { GraphQLClient } from 'graphql-request';
import * as Dom from 'graphql-request/dist/types.dom';
import gql from 'graphql-tag';
export type ApiVersionQueryVariables = Types.Exact<{ [key: string]: never }>;

export type ApiVersionQuery = { __typename: 'FullQuery'; apiVersion: string };

export const ApiVersionDocument = gql`
  query apiVersion {
    apiVersion
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
    apiVersion(
      variables?: ApiVersionQueryVariables,
      requestHeaders?: Dom.RequestInit['headers']
    ): Promise<ApiVersionQuery> {
      return withWrapper(
        wrappedRequestHeaders =>
          client.request<ApiVersionQuery>(ApiVersionDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        'apiVersion',
        'query'
      );
    },
  };
}
export type Sdk = ReturnType<typeof getSdk>;
