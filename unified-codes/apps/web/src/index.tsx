import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { App, AppStore, AppTheme } from './components';

ReactDOM.render(
  <AppStore>
    <AppTheme>
      <App/>
    </AppTheme>
  </AppStore>,
  document.getElementById('app')
);
