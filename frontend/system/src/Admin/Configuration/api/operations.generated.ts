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

export type DeleteConfigItemMutationVariables = Types.Exact<{
  code: Types.Scalars['String']['input'];
}>;


export type DeleteConfigItemMutation = { __typename?: 'FullMutation', deleteConfigurationItem: number };

export type PropertyConfigurationItemFragment = { __typename?: 'PropertyConfigurationItemNode', id: string, label: string, url: string, type: string };

export type PropertyConfigurationItemsQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type PropertyConfigurationItemsQuery = { __typename?: 'FullQuery', propertyConfigurationItems: { __typename?: 'PropertyConfigurationItemConnector', totalCount: number, data: Array<{ __typename?: 'PropertyConfigurationItemNode', id: string, label: string, url: string, type: string }> } };

export type UpsertPropertyConfigItemMutationVariables = Types.Exact<{
  input: Types.UpsertPropertyConfigItemInput;
}>;


export type UpsertPropertyConfigItemMutation = { __typename?: 'FullMutation', upsertPropertyConfigurationItem: number };

export const ConfigurationItemFragmentDoc = gql`
    fragment ConfigurationItem on ConfigurationItemNode {
  id
  name
  type
}
    `;
export const PropertyConfigurationItemFragmentDoc = gql`
    fragment PropertyConfigurationItem on PropertyConfigurationItemNode {
  id
  label
  url
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
export const DeleteConfigItemDocument = gql`
    mutation DeleteConfigItem($code: String!) {
  deleteConfigurationItem(code: $code)
}
    `;
export const PropertyConfigurationItemsDocument = gql`
    query PropertyConfigurationItems {
  propertyConfigurationItems {
    ... on PropertyConfigurationItemConnector {
      data {
        ...PropertyConfigurationItem
      }
      totalCount
    }
  }
}
    ${PropertyConfigurationItemFragmentDoc}`;
export const UpsertPropertyConfigItemDocument = gql`
    mutation UpsertPropertyConfigItem($input: UpsertPropertyConfigItemInput!) {
  upsertPropertyConfigurationItem(input: $input)
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
    },
    DeleteConfigItem(variables: DeleteConfigItemMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<DeleteConfigItemMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<DeleteConfigItemMutation>(DeleteConfigItemDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'DeleteConfigItem', 'mutation');
    },
    PropertyConfigurationItems(variables?: PropertyConfigurationItemsQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<PropertyConfigurationItemsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<PropertyConfigurationItemsQuery>(PropertyConfigurationItemsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'PropertyConfigurationItems', 'query');
    },
    UpsertPropertyConfigItem(variables: UpsertPropertyConfigItemMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<UpsertPropertyConfigItemMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<UpsertPropertyConfigItemMutation>(UpsertPropertyConfigItemDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'UpsertPropertyConfigItem', 'mutation');
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;