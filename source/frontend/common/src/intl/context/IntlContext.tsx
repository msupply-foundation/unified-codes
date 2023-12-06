import React, { FC } from 'react';
import i18next from 'i18next';
import Backend from 'i18next-chained-backend';
import LocalStorageBackend from 'i18next-localstorage-backend';
import HttpApi from 'i18next-http-backend';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { PropsWithChildrenOnly } from '@common/types';

declare const LANG_VERSION: string; // Created by webpack DefinePlugin see webpack.config.js

const defaultNS = 'common';
export const IntlProvider: FC<PropsWithChildrenOnly> = ({ children }) => {
  React.useEffect(() => {
    if (i18next.isInitialized) return;

    const minuteInMilliseconds = 60 * 1000;
    const isDevelopment = process.env['NODE_ENV'] === 'development';
    const expirationTime = isDevelopment
      ? 0
      : 7 * 24 * 60 * minuteInMilliseconds; // Cache for 7 days, on rebuild we should get a new language version so we can use a reasonably long cache

    i18next
      .use(initReactI18next) // passes i18n down to react-i18next
      .use(Backend)
      .use(LanguageDetector)
      .init({
        backend: {
          backends: [
            LocalStorageBackend, // primary backend
            HttpApi, // fallback backend
          ],
          backendOptions: [
            {
              /* options for primary backend */
              expirationTime,
              defaultVersion: 'v0.1',
              versions: { en: LANG_VERSION },
            },
            {
              /* options for secondary backend */
              loadPath: '/locales/{{lng}}/{{ns}}.json',
            },
          ],
        },
        debug: isDevelopment,
        defaultNS,
        ns: defaultNS, // behaving as I expect defaultNS should. Without specifying ns here, a request is made to 'translation.json'
        fallbackLng: 'en',
        fallbackNS: 'common',
        load: 'languageOnly', // if requested language is 'en-US' then we load 'en'; change to the default value of 'all' to load 'en-US' and 'en'
        interpolation: {
          escapeValue: false, // not needed for react!!
        },
      });
  }, []);

  return <I18nextProvider i18n={i18next}>{children}</I18nextProvider>;
};
