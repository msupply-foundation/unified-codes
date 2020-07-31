import * as React from "react";
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client";

import { MainPage } from "../src/pages";

export default { title: "MainPage" };

export const withNoProps = () => {
    const client = new ApolloClient({
        uri: "http://localhost:4000/graphql",
        cache: new InMemoryCache(),
      });

      return (
        <ApolloProvider client={client}>
            <MainPage/>
        </ApolloProvider>
      );
} 