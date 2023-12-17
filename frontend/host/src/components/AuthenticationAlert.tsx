import React, { useEffect } from 'react';
import { useToggle } from '@common/hooks';
import { AppRoute } from '@uc-frontend/config';
import {
  AuthError,
  matchPath,
  Location,
  RouteBuilder,
  useLocalStorage,
  useLocation,
  useNavigate,
  LocalStorage,
} from '@uc-frontend/common';
import { AlertModal } from '@common/components';
import { LocaleKey, TypedTFunction, useTranslation } from '@common/intl';

export const AuthenticationAlert = () => {
  const navigate = useNavigate();
  const { isOn, toggleOff, toggleOn } = useToggle();
  const t = useTranslation(['host']);
  const location = useLocation();
  const [error] = useLocalStorage('/auth/error');

  useEffect(() => {
    if (!!error) toggleOn();
    return () => toggleOff();
  }, [error]);

  // no need to alert if you are on the login screen!
  if (
    matchPath(
      RouteBuilder.create(AppRoute.Login).addWildCard().build(),
      location.pathname
    ) ||
    matchPath(
      RouteBuilder.create(AppRoute.Browse).addWildCard().build(),
      location.pathname
    ) ||
    matchPath(
      RouteBuilder.create(AppRoute.PasswordReset).addWildCard().build(),
      location.pathname
    ) ||
    matchPath(
      RouteBuilder.create(AppRoute.ForgotPassword).addWildCard().build(),
      location.pathname
    )
  ) {
    return null;
  }
  const onOk = () => {
    const state = {} as { from?: Location };
    if (error === AuthError.Unauthenticated || error === AuthError.Timeout) {
      state.from = location;
    }

    if (error === AuthError.PermissionDenied) {
      LocalStorage.setItem('/auth/error', undefined);
      return;
    }

    navigate(`/${AppRoute.Login}`, {
      replace: true,
      state,
    });
  };

  const translatedError = translateErrorMessage(error, t);
  if (!translatedError) return null;

  return (
    <AlertModal
      important
      open={isOn}
      title={translatedError.title}
      message={translatedError.message}
      onOk={onOk}
    />
  );
};

const translateErrorMessage = (
  error: AuthError | null | undefined,
  t: TypedTFunction<LocaleKey>
) => {
  switch (error) {
    case AuthError.Unauthenticated:
      return {
        title: t('auth.timeout-title'),
        message: t('auth.unauthenticated-message'),
      };
    case AuthError.Timeout:
      return {
        title: t('auth.timeout-title'),
        message: t('auth.timeout-message'),
      };
    case AuthError.PermissionDenied:
      return {
        title: t('auth.alert-title'),
        message: t('auth.permission-denied'),
      };
    default:
      return undefined;
  }
};
