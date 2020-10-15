import * as React from 'react';

import AppFooter from './AppFooter';
import AppHeader from './AppHeader';

import AppPage from './AppPage';
import AppLayout from '../../layout/AppLayout';

export interface AppProps {};

export type App = React.FunctionComponent<AppProps>;

export const App: App = () => <AppLayout header={<AppHeader/>} page={<AppPage/>} footer={<AppFooter/>} />;

export default App;
