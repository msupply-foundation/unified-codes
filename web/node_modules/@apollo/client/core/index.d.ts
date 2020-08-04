export { ApolloClient, ApolloClientOptions, DefaultOptions } from '../ApolloClient';
export { ObservableQuery, FetchMoreOptions, UpdateQueryOptions, ApolloCurrentQueryResult, } from './ObservableQuery';
export { QueryBaseOptions, QueryOptions, WatchQueryOptions, MutationOptions, SubscriptionOptions, FetchPolicy, WatchQueryFetchPolicy, ErrorPolicy, FetchMoreQueryOptions, SubscribeToMoreOptions, MutationUpdaterFn, } from './watchQueryOptions';
export { NetworkStatus } from './networkStatus';
export * from './types';
export { Resolver, FragmentMatcher as LocalStateFragmentMatcher, } from './LocalState';
export { isApolloError, ApolloError } from '../errors/ApolloError';
export * from '../cache';
export * from '../link/core';
export * from '../link/http';
export * from '../link/utils';
export { Observable, Observer, ObservableSubscription } from '../utilities/observables/Observable';
import gql from 'graphql-tag';
export declare const resetCaches: typeof gql.resetCaches, disableFragmentWarnings: typeof gql.disableFragmentWarnings, enableExperimentalFragmentVariables: typeof gql.enableExperimentalFragmentVariables, disableExperimentalFragmentVariables: typeof gql.disableExperimentalFragmentVariables;
export { gql };
//# sourceMappingURL=index.d.ts.map