import * as Types from '@uc-frontend/common';

import { GraphQLClient } from 'graphql-request';
import * as Dom from 'graphql-request/dist/types.dom';
import gql from 'graphql-tag';
export type ConfigurationItemFragment = { __typename?: 'ConfigurationItemNode', id: string, name: string, type: string };

export type ConfigurationItemsQueryVariables = Types.Exact<{
  type: Types.ConfigurationItemTypeInput;
}>;


export type ConfigurationItemsQuery = { __typename?: 'FullQuery', configurationItems: { __typename?: 'ConfigurationItemConnector', totalCount: number, data: Array<{ __typename?: 'ConfigurationItemNode', id: string, name: string, type: string }> } };

export type AddConfigItemMutationVariables = Types.Exact<{
  input: Types.AddConfigurationItemInput;
}>;


export type AddConfigItemMutation = { __typename?: 'FullMutation', addConfigurationItem: number };

export const ConfigurationItemFragmentDoc = gql`
    fragment ConfigurationItem on ConfigurationItemNode {
  id
  name
  type
}
    `;
export const ConfigurationItemsDocument = gql`
    query ConfigurationItems($type: ConfigurationItemTypeInput!) {
  configurationItems(type: $type) {
    ... on ConfigurationItemConnector {
      data {
        ...ConfigurationItem
      }
      totalCount
    }
  }
}
    ${ConfigurationItemFragmentDoc}`;
export const AddConfigItemDocument = gql`
    mutation AddConfigItem($input: AddConfigurationItemInput!) {
  addConfigurationItem(input: $input)
}
    `;

export type SdkFunctionWrapper = <T>(action: (requestHeaders?:Record<string, string>) => Promise<T>, operationName: string, operationType?: string) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = (action, _operationName, _operationType) => action();

export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    ConfigurationItems(variables: ConfigurationItemsQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<ConfigurationItemsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<ConfigurationItemsQuery>(ConfigurationItemsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'ConfigurationItems', 'query');
    },
    AddConfigItem(variables: AddConfigItemMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<AddConfigItemMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<AddConfigItemMutation>(AddConfigItemDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'AddConfigItem', 'mutation');
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;