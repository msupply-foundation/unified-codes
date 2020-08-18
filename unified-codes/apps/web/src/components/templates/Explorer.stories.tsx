import * as React from 'react';
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';

import Explorer from './Explorer';

export default { title: 'Explorer' };

export const primary = () => {
  const client = new ApolloClient({
    uri: process.env.NX_DATA_SERVICE,
    cache: new InMemoryCache(),
  });

  return (
    <ApolloProvider client={client}>
      <Explorer />
    </ApolloProvider>
  );
};
