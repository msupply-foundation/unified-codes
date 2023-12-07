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
} from '@uc-frontend/common';
import { AppDrawer, AppBar, Footer, NotFound } from './components';
import { CommandK } from './CommandK';
import { AppRoute } from '@uc-frontend/config';
import { Settings } from './Admin/Settings';
import { QueryErrorHandler } from './QueryErrorHandler';

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
        <AppDrawer />
        <Box flex={1} display="flex" flexDirection="column" overflow="hidden">
          <AppBar />
          <Box display="flex" flex={1} overflow="auto">
            <Routes>
              <Route
                path={RouteBuilder.create(AppRoute.Admin).addWildCard().build()}
                element={<Settings />}
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
