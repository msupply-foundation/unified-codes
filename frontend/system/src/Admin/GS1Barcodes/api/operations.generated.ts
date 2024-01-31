import * as Types from '@uc-frontend/common';

import { GraphQLClient } from 'graphql-request';
import * as Dom from 'graphql-request/dist/types.dom';
import gql from 'graphql-tag';
export type Gs1Fragment = { __typename?: 'Gs1Node', id: string, gtin: string, manufacturer: string, entity: { __typename?: 'EntityType', code: string, name: string, description: string } };

export type Gs1BarcodesQueryVariables = Types.Exact<{
  first?: Types.InputMaybe<Types.Scalars['Int']['input']>;
  offset?: Types.InputMaybe<Types.Scalars['Int']['input']>;
}>;


export type Gs1BarcodesQuery = { __typename?: 'FullQuery', gs1Barcodes: { __typename?: 'Gs1CollectionConnector', totalCount: number, data: Array<{ __typename?: 'Gs1Node', id: string, gtin: string, manufacturer: string, entity: { __typename?: 'EntityType', code: string, name: string, description: string } }> } };

export type AddGs1MutationVariables = Types.Exact<{
  input: Types.AddGs1Input;
}>;


export type AddGs1Mutation = { __typename?: 'FullMutation', addGs1: { __typename?: 'Gs1Node', id: string, gtin: string, manufacturer: string, entity: { __typename?: 'EntityType', code: string, name: string, description: string } } };

export type DeleteGs1MutationVariables = Types.Exact<{
  gtin: Types.Scalars['String']['input'];
}>;


export type DeleteGs1Mutation = { __typename?: 'FullMutation', deleteGs1: number };

export const Gs1FragmentDoc = gql`
    fragment GS1 on Gs1Node {
  id
  gtin
  manufacturer
  entity {
    code
    name
    description
  }
}
    `;
export const Gs1BarcodesDocument = gql`
    query Gs1Barcodes($first: Int, $offset: Int) {
  gs1Barcodes(first: $first, offset: $offset) {
    ... on Gs1CollectionConnector {
      data {
        ...GS1
      }
      totalCount
    }
  }
}
    ${Gs1FragmentDoc}`;
export const AddGs1Document = gql`
    mutation AddGs1($input: AddGS1Input!) {
  addGs1(input: $input) {
    ...GS1
  }
}
    ${Gs1FragmentDoc}`;
export const DeleteGs1Document = gql`
    mutation DeleteGS1($gtin: String!) {
  deleteGs1(gtin: $gtin)
}
    `;

export type SdkFunctionWrapper = <T>(action: (requestHeaders?:Record<string, string>) => Promise<T>, operationName: string, operationType?: string) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = (action, _operationName, _operationType) => action();

export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    Gs1Barcodes(variables?: Gs1BarcodesQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<Gs1BarcodesQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<Gs1BarcodesQuery>(Gs1BarcodesDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'Gs1Barcodes', 'query');
    },
    AddGs1(variables: AddGs1MutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<AddGs1Mutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<AddGs1Mutation>(AddGs1Document, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'AddGs1', 'mutation');
    },
    DeleteGS1(variables: DeleteGs1MutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<DeleteGs1Mutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<DeleteGs1Mutation>(DeleteGs1Document, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'DeleteGS1', 'mutation');
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;