import * as React from 'react';
import { Provider } from 'react-redux';

import { store } from '../../store';

export interface AppStoreProps {
    children: React.ReactChild | React.ReactChildren
}

export type AppStore = React.FunctionComponent<AppStoreProps>;

export const AppStore: AppStore = ({ children }) => (
    <Provider store={store}>
        {children}
    </Provider>
);
 