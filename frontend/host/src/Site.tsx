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
  useAuthContext,
} from '@uc-frontend/common';
import { AppBar, AppDrawer, Footer, NotFound } from './components';
import { CommandK } from './CommandK';
import { AppRoute } from '@uc-frontend/config';
import { Settings } from './Settings/Settings';
import { QueryErrorHandler } from './QueryErrorHandler';
import { EntitiesRouter } from './routers/EntitiesRouter';
import { AdminRouter } from './routers/AdminRouter';
import { RequireAuthentication } from './components/Navigation/RequireAuthentication';

export const Site: FC = () => {
  const location = useLocation();
  const getPageTitle = useGetPageTitle();
  const { setPageTitle } = useHostContext();
  const { user } = useAuthContext();

  useEffect(() => {
    setPageTitle(getPageTitle(location.pathname));
  }, [location]);

  return (
    <CommandK>
      <SnackbarProvider maxSnack={3}>
        {user ? <AppDrawer /> : null}
        <Box flex={1} display="flex" flexDirection="column" overflow="hidden">
          <AppBar />
          <Box display="flex" flex={1} overflow="auto" paddingX={'24px'}>
            <Routes>
              <Route
                path={RouteBuilder.create(AppRoute.Browse)
                  .addWildCard()
                  .build()}
                element={<EntitiesRouter />}
              />
              <Route
                path={RouteBuilder.create(AppRoute.Admin).addWildCard().build()}
                element={
                  <RequireAuthentication>
                    <AdminRouter />
                  </RequireAuthentication>
                }
              />
              <Route
                path={RouteBuilder.create(AppRoute.Settings)
                  .addWildCard()
                  .build()}
                element={<Settings />}
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
  );
};
