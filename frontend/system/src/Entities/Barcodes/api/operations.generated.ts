import * as Types from '@uc-frontend/common';

import { GraphQLClient } from 'graphql-request';
import * as Dom from 'graphql-request/dist/types.dom';
import gql from 'graphql-tag';
export type BarcodeFragment = { __typename?: 'BarcodeNode', id: string, gtin: string, manufacturer: string, entity: { __typename?: 'EntityType', code: string, name: string, description: string } };

export type BarcodesQueryVariables = Types.Exact<{
  first?: Types.InputMaybe<Types.Scalars['Int']['input']>;
  offset?: Types.InputMaybe<Types.Scalars['Int']['input']>;
}>;


export type BarcodesQuery = { __typename?: 'FullQuery', barcodes: { __typename?: 'BarcodeCollectionConnector', totalCount: number, data: Array<{ __typename?: 'BarcodeNode', id: string, gtin: string, manufacturer: string, entity: { __typename?: 'EntityType', code: string, name: string, description: string } }> } };

export type AddBarcodeMutationVariables = Types.Exact<{
  input: Types.AddBarcodeInput;
}>;


export type AddBarcodeMutation = { __typename?: 'FullMutation', addBarcode: { __typename?: 'BarcodeNode', id: string, gtin: string, manufacturer: string, entity: { __typename?: 'EntityType', code: string, name: string, description: string } } };

export type DeleteBarcodeMutationVariables = Types.Exact<{
  gtin: Types.Scalars['String']['input'];
}>;


export type DeleteBarcodeMutation = { __typename?: 'FullMutation', deleteBarcode: number };

export type EntityWithBarcodesFragment = { __typename?: 'EntityType', code: string, name: string, description: string, type: string, barcodes: Array<{ __typename?: 'BarcodeType', id: string, gtin: string, manufacturer: string }> };

export type EntityWithBarcodesQueryVariables = Types.Exact<{
  code: Types.Scalars['String']['input'];
}>;


export type EntityWithBarcodesQuery = { __typename?: 'FullQuery', entity?: { __typename?: 'EntityType', code: string, name: string, description: string, type: string, children: Array<{ __typename?: 'EntityType', code: string, name: string, description: string, type: string, children: Array<{ __typename?: 'EntityType', code: string, name: string, description: string, type: string, children: Array<{ __typename?: 'EntityType', code: string, name: string, description: string, type: string, children: Array<{ __typename?: 'EntityType', code: string, name: string, description: string, type: string, children: Array<{ __typename?: 'EntityType', code: string, name: string, description: string, type: string, children: Array<{ __typename?: 'EntityType', code: string, name: string, description: string, type: string, children: Array<{ __typename?: 'EntityType', code: string, name: string, description: string, type: string, children: Array<{ __typename?: 'EntityType', code: string, name: string, description: string, type: string, children: Array<{ __typename?: 'EntityType', code: string, name: string, description: string, type: string, barcodes: Array<{ __typename?: 'BarcodeType', id: string, gtin: string, manufacturer: string }> }>, barcodes: Array<{ __typename?: 'BarcodeType', id: string, gtin: string, manufacturer: string }> }>, barcodes: Array<{ __typename?: 'BarcodeType', id: string, gtin: string, manufacturer: string }> }>, barcodes: Array<{ __typename?: 'BarcodeType', id: string, gtin: string, manufacturer: string }> }>, barcodes: Array<{ __typename?: 'BarcodeType', id: string, gtin: string, manufacturer: string }> }>, barcodes: Array<{ __typename?: 'BarcodeType', id: string, gtin: string, manufacturer: string }> }>, barcodes: Array<{ __typename?: 'BarcodeType', id: string, gtin: string, manufacturer: string }> }>, barcodes: Array<{ __typename?: 'BarcodeType', id: string, gtin: string, manufacturer: string }> }>, barcodes: Array<{ __typename?: 'BarcodeType', id: string, gtin: string, manufacturer: string }> }>, barcodes: Array<{ __typename?: 'BarcodeType', id: string, gtin: string, manufacturer: string }> } | null };

export const BarcodeFragmentDoc = gql`
    fragment Barcode on BarcodeNode {
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
export const EntityWithBarcodesFragmentDoc = gql`
    fragment EntityWithBarcodes on EntityType {
  code
  name
  description
  type
  barcodes {
    id
    gtin
    manufacturer
  }
}
    `;
export const BarcodesDocument = gql`
    query Barcodes($first: Int, $offset: Int) {
  barcodes(first: $first, offset: $offset) {
    ... on BarcodeCollectionConnector {
      data {
        ...Barcode
      }
      totalCount
    }
  }
}
    ${BarcodeFragmentDoc}`;
export const AddBarcodeDocument = gql`
    mutation AddBarcode($input: AddBarcodeInput!) {
  addBarcode(input: $input) {
    ...Barcode
  }
}
    ${BarcodeFragmentDoc}`;
export const DeleteBarcodeDocument = gql`
    mutation DeleteBarcode($gtin: String!) {
  deleteBarcode(gtin: $gtin)
}
    `;
export const EntityWithBarcodesDocument = gql`
    query entityWithBarcodes($code: String!) {
  entity(code: $code) {
    ...EntityWithBarcodes
    children {
      ...EntityWithBarcodes
      children {
        ...EntityWithBarcodes
        children {
          ...EntityWithBarcodes
          children {
            ...EntityWithBarcodes
            children {
              ...EntityWithBarcodes
              children {
                ...EntityWithBarcodes
                children {
                  ...EntityWithBarcodes
                  children {
                    ...EntityWithBarcodes
                    children {
                      ...EntityWithBarcodes
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
    ${EntityWithBarcodesFragmentDoc}`;

export type SdkFunctionWrapper = <T>(action: (requestHeaders?:Record<string, string>) => Promise<T>, operationName: string, operationType?: string) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = (action, _operationName, _operationType) => action();

export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    Barcodes(variables?: BarcodesQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<BarcodesQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<BarcodesQuery>(BarcodesDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'Barcodes', 'query');
    },
    AddBarcode(variables: AddBarcodeMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<AddBarcodeMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<AddBarcodeMutation>(AddBarcodeDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'AddBarcode', 'mutation');
    },
    DeleteBarcode(variables: DeleteBarcodeMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<DeleteBarcodeMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<DeleteBarcodeMutation>(DeleteBarcodeDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'DeleteBarcode', 'mutation');
    },
    entityWithBarcodes(variables: EntityWithBarcodesQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<EntityWithBarcodesQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<EntityWithBarcodesQuery>(EntityWithBarcodesDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'entityWithBarcodes', 'query');
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;