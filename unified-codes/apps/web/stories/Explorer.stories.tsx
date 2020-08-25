import * as React from 'react';
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';

import { Explorer } from '../src/components/templates';

export default { title: 'Explorer' };

export const withNoProps = () => {
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
