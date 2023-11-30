import React from 'react';
import Bugsnag from '@bugsnag/js';

import {
  BrowserRouter,
  Routes,
  Route,
  Box,
  AppThemeProvider,
  QueryClient,
  QueryClientProvider,
  RouteBuilder,
  ErrorBoundary,
  GenericErrorFallback,
  GqlProvider,
  IntlProvider,
  RandomLoader,
  ConfirmationModalProvider,
  AlertModalProvider,
  EnvUtils,
} from '@uc-frontend/common';
import { AppRoute, Environment } from '@uc-frontend/config';
import { Login, PasswordReset, ForgotPassword, Viewport } from './components';
import { Site } from './Site';
import { AuthenticationAlert } from './components/AuthenticationAlert';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // These are disabled during development because they're
      // annoying to have constantly refetching.
      refetchOnWindowFocus: EnvUtils.isProduction(),
      retry: EnvUtils.isProduction(),
      // This is the default in v4 which is currently in alpha as it is
      // what most users think the default is.
      // This will subscribe components of a query only to the data they
      // destructure. I.e. if the component does not read the isLoading
      // field, the component will not re-render when the state changes.
      notifyOnChangeProps: 'tracked',
    },
  },
});
if (Environment.BUGSNAG_API_KEY) {
  Bugsnag.start({
    apiKey: Environment.BUGSNAG_API_KEY,
    appVersion: Environment.BUILD_VERSION,
    enabledBreadcrumbTypes: ['error'],
  });
}

const Host = () => (
  <React.Suspense fallback={<div />}>
    <IntlProvider>
      <React.Suspense fallback={<RandomLoader />}>
        <ErrorBoundary Fallback={GenericErrorFallback}>
          <QueryClientProvider client={queryClient}>
            <GqlProvider url={Environment.GRAPHQL_URL}>
              {/* <AuthProvider
                cookieLifetimeMinutes={Environment.COOKIE_LIFETIME_MINUTES}
              > */}
              <AppThemeProvider>
                <ConfirmationModalProvider>
                  <AlertModalProvider>
                    <BrowserRouter>
                      <AuthenticationAlert />
                      <Viewport>
                        <Box display="flex" minHeight="100%">
                          <Routes>
                            <Route
                              path={RouteBuilder.create(AppRoute.Login).build()}
                              element={<Login />}
                            />
                            <Route
                              path={RouteBuilder.create(
                                AppRoute.PasswordReset
                              ).build()}
                              element={<PasswordReset />}
                            />
                            <Route
                              path={RouteBuilder.create(
                                AppRoute.ForgotPassword
                              ).build()}
                              element={<ForgotPassword />}
                            />
                            <Route path="*" element={<Site />} />
                          </Routes>
                        </Box>
                      </Viewport>
                    </BrowserRouter>
                  </AlertModalProvider>
                </ConfirmationModalProvider>
              </AppThemeProvider>
              {/* </AuthProvider> */}
            </GqlProvider>
          </QueryClientProvider>
        </ErrorBoundary>
      </React.Suspense>
    </IntlProvider>
  </React.Suspense>
);

export default Host;
