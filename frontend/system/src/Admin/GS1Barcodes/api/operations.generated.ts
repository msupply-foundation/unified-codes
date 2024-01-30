import * as Types from '@uc-frontend/common';

import { GraphQLClient } from 'graphql-request';
import * as Dom from 'graphql-request/dist/types.dom';
import gql from 'graphql-tag';
export type Gs1Fragment = { __typename?: 'Gs1Node', id: string, gtin: string, manufacturer: string, entity: { __typename?: 'EntityType', code: string, name: string, description: string } };

export type Gs1BarcodesQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type Gs1BarcodesQuery = { __typename?: 'FullQuery', gs1Barcodes: { __typename?: 'Gs1CollectionConnector', totalCount: number, data: Array<{ __typename?: 'Gs1Node', id: string, gtin: string, manufacturer: string, entity: { __typename?: 'EntityType', code: string, name: string, description: string } }> } };

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
    query Gs1Barcodes {
  gs1Barcodes {
    ... on Gs1CollectionConnector {
      data {
        ...GS1
      }
      totalCount
    }
  }
}
    ${Gs1FragmentDoc}`;

export type SdkFunctionWrapper = <T>(action: (requestHeaders?:Record<string, string>) => Promise<T>, operationName: string, operationType?: string) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = (action, _operationName, _operationType) => action();

export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    Gs1Barcodes(variables?: Gs1BarcodesQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<Gs1BarcodesQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<Gs1BarcodesQuery>(Gs1BarcodesDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'Gs1Barcodes', 'query');
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;