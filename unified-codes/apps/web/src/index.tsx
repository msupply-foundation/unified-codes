import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import { ThemeProvider } from '@material-ui/core/styles';
import theme from './muiTheme';

import App from './App';
import { store } from './store';

const client = new ApolloClient({
  uri: process.env.NX_DATA_SERVICE,
  cache: new InMemoryCache(),
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </Provider>
  </ApolloProvider>,
  document.getElementById('app')
);
