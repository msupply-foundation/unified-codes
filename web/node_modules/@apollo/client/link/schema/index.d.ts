/// <reference types="zen-observable" />
import { GraphQLSchema } from 'graphql/type/schema';
import { ApolloLink } from '../core/ApolloLink';
import { Operation, FetchResult } from '../core/types';
import { Observable } from '../../utilities/observables/Observable';
export declare namespace SchemaLink {
    type ResolverContextFunction = (operation: Operation) => Record<string, any>;
    interface Options {
        schema: GraphQLSchema;
        rootValue?: any;
        context?: ResolverContextFunction | Record<string, any>;
    }
}
export declare class SchemaLink extends ApolloLink {
    schema: GraphQLSchema;
    rootValue: any;
    context: SchemaLink.ResolverContextFunction | any;
    constructor({ schema, rootValue, context }: SchemaLink.Options);
    request(operation: Operation): Observable<FetchResult> | null;
}
//# sourceMappingURL=index.d.ts.map