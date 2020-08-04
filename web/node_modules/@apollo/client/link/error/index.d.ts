/// <reference types="zen-observable" />
import { GraphQLError, ExecutionResult } from 'graphql';
import { ApolloLink } from '../core/ApolloLink';
import { Observable } from '../../utilities/observables/Observable';
import { Operation, FetchResult } from '../core/types';
import { NextLink } from '../core/types';
import { ServerError } from '../utils/throwServerError';
import { ServerParseError } from '../http/parseAndCheckHttpResponse';
export interface ErrorResponse {
    graphQLErrors?: ReadonlyArray<GraphQLError>;
    networkError?: Error | ServerError | ServerParseError;
    response?: ExecutionResult;
    operation: Operation;
    forward: NextLink;
}
export declare namespace ErrorLink {
    interface ErrorHandler {
        (error: ErrorResponse): Observable<FetchResult> | void;
    }
}
export import ErrorHandler = ErrorLink.ErrorHandler;
export declare function onError(errorHandler: ErrorHandler): ApolloLink;
export declare class ErrorLink extends ApolloLink {
    private link;
    constructor(errorHandler: ErrorLink.ErrorHandler);
    request(operation: Operation, forward: NextLink): Observable<FetchResult> | null;
}
//# sourceMappingURL=index.d.ts.map