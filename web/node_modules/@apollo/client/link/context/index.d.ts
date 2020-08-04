import { ApolloLink } from '../core/ApolloLink';
import { GraphQLRequest } from '../core/types';
export declare type ContextSetter = (operation: GraphQLRequest, prevContext: any) => Promise<any> | any;
export declare function setContext(setter: ContextSetter): ApolloLink;
//# sourceMappingURL=index.d.ts.map