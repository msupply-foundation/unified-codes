import * as React from "react";
import { ApolloProvider, ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client";
import { setContext } from '@apollo/client/link/context';

import { MainPage } from "./pages";

export const App = () => {
    const httpLink = createHttpLink({
        uri: '/graphql',
      });

    interface Context {
        headers?: Record<string, string>;
    }
    type ContextSetter = (operation: any, prevContext: Context) => Promise<Context> | any;
    const contextSetter:ContextSetter = (_, { headers }) => {
        // get the authentication token from local storage if it exists
        const token = localStorage.getItem('token');
        // return the headers to the context so httpLink can read them
        return {
            headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : "",
            }
        }
    } 
    const authLink = setContext(contextSetter);

    const client = new ApolloClient({
        // TODO: lift the URL out of here
        uri: 'http://localhost:4000/graphql',
        cache: new InMemoryCache(),
        link: authLink.concat(httpLink),
    });
    return <ApolloProvider client={client}><MainPage/></ApolloProvider>;
};