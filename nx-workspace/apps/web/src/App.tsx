import * as React from "react";
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client";

import { MainPage } from "./pages";

export const App = () => {
  const client = new ApolloClient({
    uri: "http://localhost:4000/graphql",
    cache: new InMemoryCache(),
  });
  return (
    <ApolloProvider client={client}>
      <MainPage />
    </ApolloProvider>
  );
};
