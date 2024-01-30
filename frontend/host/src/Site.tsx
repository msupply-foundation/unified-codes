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
  Paper,
  useAuthContext,
  PropsWithChildrenOnly,
} from '@uc-frontend/common';
import { AppBar, AppDrawer, Footer, NotFound } from './components';
import { CommandK } from './CommandK';
import { AppRoute } from '@uc-frontend/config';
import { Settings } from './Settings/Settings';
import { QueryErrorHandler } from './QueryErrorHandler';
import { EntitiesRouter } from './routers/EntitiesRouter';
import { AdminRouter } from './routers/AdminRouter';
import { RequireAuthentication } from './components/Navigation/RequireAuthentication';
import { RedirectDetails } from './RedirectDetails';

const AboutPage = React.lazy(
  () => import('@uc-frontend/system/src/About/About')
);

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
                element={
                  <PageContainer>
                    <EntitiesRouter />
                  </PageContainer>
                }
              />
              <Route
                path={RouteBuilder.create(AppRoute.Admin).addWildCard().build()}
                element={
                  <PageContainer>
                    <RequireAuthentication>
                      <AdminRouter />
                    </RequireAuthentication>
                  </PageContainer>
                }
              />
              <Route
                path={RouteBuilder.create(AppRoute.Settings)
                  .addWildCard()
                  .build()}
                element={<Settings />}
              />
              <Route
                path={RouteBuilder.create(AppRoute.About).build()}
                element={
                  <PageContainer>
                    <AboutPage />
                  </PageContainer>
                }
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
              <Route path={'/detail/:code'} element={<RedirectDetails />} />
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

const PageContainer = ({ children }: PropsWithChildrenOnly) => {
  return (
    <Paper
      sx={{
        backgroundColor: 'background.menu',
        borderRadius: '16px',
        flex: 1,
        margin: '10px auto',
        maxWidth: '1200px',
        padding: '16px',
        width: '100%',
      }}
    >
      <Box
        sx={{
          backgroundColor: 'white',
          display: 'flex',
          borderRadius: '16px',
          paddingX: '16px',
          height: '100%',
          overflow: 'auto',
        }}
      >
        {children}
      </Box>
    </Paper>
  );
};
