import * as React from "react";
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client";

import { Login } from "../src/components/templates";

export default { title: "Login" };

export const withNoProps = () => {
  const client = new ApolloClient({
    uri: "http://localhost:4000/graphql",
    cache: new InMemoryCache(),
  });

  return (
    <ApolloProvider client={client}>
      <Login />
    </ApolloProvider>
  );
};
