import React, { FC, PropsWithChildren, useEffect } from 'react';
import { AppThemeProvider } from '@common/styles';
import { SupportedLocales } from '@common/intl';
import { PropsWithChildrenOnly } from '@common/types';
import mediaQuery from 'css-mediaquery';
import { SnackbarProvider } from 'notistack';
import { QueryClientProvider, QueryClient } from 'react-query';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { TableProvider, createTableStore } from '../../ui/layout/tables';
import { GqlProvider } from '../..';
import { Environment } from '@uc-frontend/config';
import { renderHook } from '@testing-library/react';
import i18next from 'i18next';
import { initReactI18next, I18nextProvider } from 'react-i18next';
import host from '@common/intl/locales/en/host.json';
import system from '@common/intl/locales/en/system.json';
import common from '@common/intl/locales/en/common.json';
import hostFr from '@common/intl/locales/fr/host.json';
import commonFr from '@common/intl/locales/fr/common.json';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // ✅ turns retries off
      retry: false,
    },
  },
});

interface IntlTestProviderProps {
  locale: SupportedLocales;
}

const resources = {
  en: { host, system, common },
  fr: {
    host: { ...host, ...hostFr },
    system: { ...system },
    common: { ...common, ...commonFr },
  },
};

export const IntlTestProvider: FC<PropsWithChildren<IntlTestProviderProps>> = ({
  children,
  locale,
}) => {
  useEffect(() => {
    i18next.changeLanguage(locale);
  }, [locale]);

  if (!i18next.isInitialized) {
    i18next.use(initReactI18next).init({
      resources,
      debug: false,
      lng: locale,
      fallbackLng: 'en',
      ns: ['host', 'system', 'common'],
      defaultNS: 'common',
      fallbackNS: 'common',
      interpolation: {
        escapeValue: false,
      },
    });
  }
  return <I18nextProvider i18n={i18next}>{children}</I18nextProvider>;
};

interface TestingRouterProps {
  initialEntries: string[];
}

export const TestingRouter: FC<PropsWithChildren<TestingRouterProps>> = ({
  children,
  initialEntries,
}) => (
  <MemoryRouter initialEntries={initialEntries}>
    <Routes>{children}</Routes>
  </MemoryRouter>
);

export const TestingRouterContext: FC<PropsWithChildrenOnly> = ({
  children,
}) => (
  <TestingRouter initialEntries={['/testing']}>
    <Route path="/testing" element={<>{children}</>} />
  </TestingRouter>
);

export const TestingProvider: FC<
  PropsWithChildren<{
    locale?: 'en' | 'fr' | 'ar';
  }>
> = ({ children, locale = 'en' }) => (
  <React.Suspense fallback={<span>[suspended]</span>}>
    <QueryClientProvider client={queryClient}>
      <GqlProvider url={Environment.GRAPHQL_URL}>
        <SnackbarProvider maxSnack={3}>
          <IntlTestProvider locale={locale}>
            <TableProvider createStore={createTableStore}>
              <AppThemeProvider>{children}</AppThemeProvider>
            </TableProvider>
          </IntlTestProvider>
        </SnackbarProvider>
      </GqlProvider>
    </QueryClientProvider>
  </React.Suspense>
);

function createMatchMedia(width: number) {
  return (query: any) => ({
    matches: mediaQuery.match(query, { width }),
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  });
}

export const setScreenSize_ONLY_FOR_TESTING = (screenSize: number): void => {
  window.matchMedia = createMatchMedia(screenSize);
};

export const renderHookWithProvider = <Props, Result>(
  hook: (props: Props) => Result,
  options?: {
    providerProps?: { locale: 'en' | 'fr' | 'ar' };
  }
) =>
  renderHook(hook, {
    wrapper: ({ children }: { children?: React.ReactNode }) => (
      <TestingProvider {...options?.providerProps}>{children}</TestingProvider>
    ),
  });
