import * as React from 'react';
import { BrowserRouter } from 'react-router-dom';

export interface AppRouterProps {
  children: React.ReactChild | React.ReactChildren;
}

export type AppRouter = React.FunctionComponent<AppRouterProps>;

export const AppRouter: AppRouter = ({ children }) => <BrowserRouter>{children}</BrowserRouter>;

export default AppRouter;
