import React, { createContext, useMemo, useState, useEffect, FC } from 'react';
import { IntlUtils } from 'frontend/common/src/intl';
import { LocalStorage, useLocalStorage } from '../localStorage';
import Cookies from 'js-cookie';
import { addMinutes } from 'date-fns';
import { useGql } from '../api';
import { useGetRefreshToken } from './api/hooks';
import { useGetAuthToken } from './api/hooks/useGetAuthToken';
import { useUserDetails } from './api/hooks/useUserDetails';
import { AuthenticationResponse } from './api';
import {
  PermissionNode,
  PropsWithChildrenOnly,
} from 'frontend/common/src/types';
import { DefinitionNode, DocumentNode, OperationDefinitionNode } from 'graphql';

const DEFAULT_COOKIE_LIFETIME_MINUTES = 60;
const TOKEN_CHECK_INTERVAL = 60 * 1000;

export enum AuthError {
  PermissionDenied = 'Forbidden',
  Unauthenticated = 'Unauthenticated',
  Timeout = 'Timeout',
}

export type User = {
  id: string;
  username: string;
  displayName: string;
  permissions: PermissionNode[];
  email: string | null | undefined;
};

interface AuthCookie {
  expires?: Date;
  token: string;
  user?: User;
}

type MRUCredentials = {
  username?: string;
};

interface AuthControl {
  error?: AuthError | null;
  isLoggingIn: boolean;
  login: (
    username: string,
    password: string
  ) => Promise<AuthenticationResponse>;
  logout: () => void;
  mostRecentlyUsedCredentials?: MRUCredentials | null;
  setError?: (error: AuthError) => void;
  token: string;
  user?: User;
  permissions?: PermissionNode[];
  hasPermission: (permission: PermissionNode) => boolean;
}

export const getAuthCookie = (): AuthCookie => {
  const authString = Cookies.get('auth');
  const emptyCookie = { token: '' };
  if (!!authString) {
    try {
      const parsed = JSON.parse(authString) as AuthCookie;
      return parsed;
    } catch {
      return emptyCookie;
    }
  }
  return emptyCookie;
};

const setAuthCookie = (cookie: AuthCookie, expiry: number) => {
  const expires = addMinutes(new Date(), expiry);
  const authCookie = { ...cookie, expires };

  Cookies.set('auth', JSON.stringify(authCookie), { expires });
};

const useRefreshingAuth = (
  callback: (token?: string) => void,
  token?: string,
  refetchIntervalMinutes: number = DEFAULT_COOKIE_LIFETIME_MINUTES
) => {
  const { setHeader } = useGql();
  setHeader('Authorization', `Bearer ${token}`);
  const { data, enabled, isSuccess } = useGetRefreshToken(
    token ?? '',
    refetchIntervalMinutes
  );
  useEffect(() => {
    if (isSuccess && enabled) callback(data?.token ?? '');
  }, [enabled, isSuccess, data]);
};
const AuthContext = createContext<AuthControl>({
  token: '',
  isLoggingIn: false,
  login: () =>
    new Promise(() => ({
      token: '',
    })),
  logout: () => {},
  hasPermission: () => false,
});

const { Provider } = AuthContext;

export const AuthProvider: FC<
  PropsWithChildrenOnly & { cookieLifetimeMinutes: number }
> = ({ children, cookieLifetimeMinutes }) => {
  const [mostRecentlyUsedCredentials, setMRUCredentials] =
    useLocalStorage('/mru/credentials');
  const i18n = IntlUtils.useI18N();
  const defaultLanguage = IntlUtils.useDefaultLanguage();
  const { mutateAsync, isLoading: isLoggingIn } = useGetAuthToken();
  const authCookie = getAuthCookie();
  const [cookie, setCookie] = useState<AuthCookie | undefined>(authCookie);
  const [error, setError] = useLocalStorage('/auth/error');
  const { mutateAsync: getUserDetail } = useUserDetails();
  const { setHeader, setSkipRequest } = useGql();

  const saveToken = (token?: string) => {
    const authCookie = getAuthCookie();
    const newCookie = { ...authCookie, token: token ?? '' };
    setAuthCookie(newCookie, cookieLifetimeMinutes);
    setCookie(newCookie);
  };
  useRefreshingAuth(saveToken, cookie?.token, cookieLifetimeMinutes);

  const authNameQueries = ['authToken', 'me']; // 'me' is required here, as the front end code doesn't update the login state until a successful 'me' request is completed.
  const isAuthRequest = (definitionNode: DefinitionNode) => {
    const operationNode = definitionNode as OperationDefinitionNode;
    if (!operationNode) return false;
    if (operationNode.operation !== 'query') return false;

    return authNameQueries.indexOf(operationNode.name?.value ?? '') !== -1;
  };

  const skipAfterAuthError = (documentNode?: DocumentNode) => {
    if (!documentNode) return false;

    if (documentNode.definitions.some(isAuthRequest)) return false;

    switch (LocalStorage.getItem('/auth/error')) {
      case AuthError.Unauthenticated:
      case AuthError.Timeout:
        return true;
      default:
        return false;
    }
  };

  const login = async (username: string, password: string) => {
    setSkipRequest(skipAfterAuthError);
    const { token, error } = await mutateAsync({ username, password });
    setHeader('Authorization', `Bearer ${token}`);
    const userDetails = await getUserDetail(token);

    const authCookie = {
      token,
      user: {
        id: userDetails?.id ?? 'INVALIDID',
        username: username,
        displayName: userDetails?.displayName ?? username,
        email: userDetails?.email,
        permissions: userDetails?.permissions ?? [],
      },
    };

    // When the a user first logs in, check that their browser language is an internally supported
    // language. If not, set their language to the default.
    const { language } = i18n;
    if (!IntlUtils.isSupportedLang(language)) {
      i18n.changeLanguage(defaultLanguage);
    }

    setMRUCredentials({ username });
    setAuthCookie(authCookie, cookieLifetimeMinutes);
    if (!!token) {
      setError(undefined);
    }
    setCookie(authCookie);

    return { token, error, user: authCookie.user };
  };

  const logout = () => {
    Cookies.remove('auth');
    setError(undefined);
    setCookie(undefined);
  };

  const hasPermission = (permission: PermissionNode): boolean => {
    if (!Array.isArray(authCookie.user?.permissions)) {
      return false;
    }
    return authCookie.user?.permissions.includes(permission) ?? false;
  };

  const val = useMemo(
    () => ({
      error,
      isLoggingIn,
      login,
      logout,
      token: cookie?.token || '',
      user: cookie?.user,
      mostRecentlyUsedCredentials,
      setError,
      hasPermission,
    }),
    [login, cookie, error, mostRecentlyUsedCredentials, isLoggingIn, setError]
  );

  useEffect(() => {
    // check every minute for a valid token
    // if the cookie has expired, raise an auth error
    const timer = window.setInterval(() => {
      const authCookie = getAuthCookie();
      const { token } = authCookie;
      if (!token) {
        setError(AuthError.Timeout);
        window.clearInterval(timer);
      }
    }, TOKEN_CHECK_INTERVAL);
    return () => window.clearInterval(timer);
  }, [cookie?.token]); // cookie is passed here so that this timer is reset when the token changes (i.e. the user logs in again)

  return <Provider value={val}>{children}</Provider>;
};

export const useAuthContext = (): AuthControl => {
  const authControl = React.useContext(AuthContext);
  return authControl;
};
