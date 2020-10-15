import * as React from 'react';
import * as ReactDOM from 'react-dom';

import App from './components/containers/app/App';
import AppStore from './components/containers/app/AppStore';
import AppTheme from './components/containers/app/AppTheme';
import AppRouter from './components/containers/app/AppRouter';

ReactDOM.render(
  <AppStore>
    <AppRouter>
      <AppTheme>
        <App/>
      </AppTheme>
    </AppRouter>
  </AppStore>,
  document.getElementById('app')
);