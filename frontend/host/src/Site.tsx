import React, { FC, useEffect } from 'react';

import {
  AppFooterPortal,
  Box,
  SnackbarProvider,
  AppFooter,
  Routes,
  Route,
  RouteBuilder,
  useLocation,
  useHostContext,
  useGetPageTitle,
  DetailPanel,
  Navigate,
} from '@uc-frontend/common';
import { AppBar, Footer, NotFound } from './components';
import { CommandK } from './CommandK';
import { AppRoute } from '@uc-frontend/config';
import { Settings } from './Admin/Settings';
import { QueryErrorHandler } from './QueryErrorHandler';
import { EntitiesRouter } from './routers/EntitiesRouter';

export const Site: FC = () => {
  const location = useLocation();
  const getPageTitle = useGetPageTitle();
  const { setPageTitle } = useHostContext();

  useEffect(() => {
    setPageTitle(getPageTitle(location.pathname));
  }, [location]);

  return (
    // <RequireAuthentication>
    <CommandK>
      <SnackbarProvider maxSnack={3}>
        {/* TODO: only show AppDrawer when logged in as an Admin */}
        {/* <AppDrawer /> */}
        <Box flex={1} display="flex" flexDirection="column" overflow="hidden">
          <AppBar />
          <Box display="flex" flex={1} overflow="auto">
            <Routes>
              <Route
                path={RouteBuilder.create(AppRoute.Admin).addWildCard().build()}
                element={<Settings />}
              />
              <Route
                path={RouteBuilder.create(AppRoute.Browse)
                  .addWildCard()
                  .build()}
                element={<EntitiesRouter />}
              />
              <Route
                path={RouteBuilder.create(AppRoute.Home).build()}
                element={
                  <Navigate
                    to={RouteBuilder.create(AppRoute.Browse).build()}
                    replace={true}
                  />
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Box>
          <AppFooter />
          <AppFooterPortal SessionDetails={<Footer />} />
        </Box>
        <DetailPanel />
        <QueryErrorHandler />
      </SnackbarProvider>
    </CommandK>
    // </RequireAuthentication>
  );
};
