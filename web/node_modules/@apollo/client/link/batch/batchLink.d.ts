/// <reference types="zen-observable" />
import { ApolloLink } from '../core/ApolloLink';
import { Operation, FetchResult } from '../core/types';
import { Observable } from '../../utilities/observables/Observable';
import { NextLink } from '../core/types';
import { BatchHandler } from './batching';
export { OperationBatcher, BatchableRequest, BatchHandler } from './batching';
export declare namespace BatchLink {
    interface Options {
        batchInterval?: number;
        batchMax?: number;
        batchHandler?: BatchHandler;
        batchKey?: (operation: Operation) => string;
    }
}
export declare class BatchLink extends ApolloLink {
    private batcher;
    constructor(fetchParams?: BatchLink.Options);
    request(operation: Operation, forward?: NextLink): Observable<FetchResult> | null;
}
//# sourceMappingURL=batchLink.d.ts.map