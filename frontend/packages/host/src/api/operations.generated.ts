import * as Types from '@uc-frontend/common';

import { GraphQLClient } from 'graphql-request';
import * as Dom from 'graphql-request/dist/types.dom';
import gql from 'graphql-tag';
export type EntityQueryVariables = Types.Exact<{
  code: Types.Scalars['String']['input'];
}>;


export type EntityQuery = { __typename: 'Query', entity?: { __typename: 'EntityType', code: string, description?: string | null, type: string, properties?: Array<{ __typename: 'PropertyType', type: string, value: string }> | null, children?: Array<{ __typename: 'EntityType', code: string, description?: string | null, type: string, properties?: Array<{ __typename: 'PropertyType', type: string, value: string }> | null, children?: Array<{ __typename: 'EntityType', code: string, description?: string | null, type: string, properties?: Array<{ __typename: 'PropertyType', type: string, value: string }> | null, children?: Array<{ __typename: 'EntityType', code: string, description?: string | null, type: string, properties?: Array<{ __typename: 'PropertyType', type: string, value: string }> | null, children?: Array<{ __typename: 'EntityType', code: string, description?: string | null, type: string, properties?: Array<{ __typename: 'PropertyType', type: string, value: string }> | null, children?: Array<{ __typename: 'EntityType', code: string, description?: string | null, type: string, properties?: Array<{ __typename: 'PropertyType', type: string, value: string }> | null }> | null }> | null }> | null }> | null }> | null } | null };


export const EntityDocument = gql`
    query entity($code: String!) {
  entity(code: $code) {
    code
    description
    type
    properties {
      type
      value
    }
    children {
      code
      description
      type
      properties {
        type
        value
      }
      children {
        code
        description
        type
        properties {
          type
          value
        }
        children {
          code
          description
          type
          properties {
            type
            value
          }
          children {
            code
            description
            type
            properties {
              type
              value
            }
            children {
              code
              description
              type
              properties {
                type
                value
              }
            }
          }
        }
      }
    }
  }
}
    `;

export type SdkFunctionWrapper = <T>(action: (requestHeaders?:Record<string, string>) => Promise<T>, operationName: string, operationType?: string) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = (action, _operationName, _operationType) => action();

export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    entity(variables: EntityQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<EntityQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<EntityQuery>(EntityDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'entity', 'query');
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;