import * as React from 'react';
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';

import { LoginComponent } from './Login';

export default { title: 'Login' };

export const primary = () => {
  const client = new ApolloClient({
    uri: process.env.NX_DATA_SERVICE,
    cache: new InMemoryCache(),
  });

  const onLogin = () => console.log('Called callback: onLogin');

  return (
    <ApolloProvider client={client}>
      <LoginComponent onLogin={onLogin} />
    </ApolloProvider>
  );
};
