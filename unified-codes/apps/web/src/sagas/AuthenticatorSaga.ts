import { call, put, takeEvery, all } from 'redux-saga/effects';

import {
  AuthenticationService,
  IdentityProvider,
  IKeyCloakConfig,
  KeyCloakIdentityProvider,
  User,
} from '@unified-codes/data';

import AuthenticatorActions, {
  IAuthenticateAction,
  AUTHENTICATOR_ACTIONS,
} from '../actions/AuthenticatorActions';

function* authenticate(action: IAuthenticateAction) {
  const { credentials } = action;

  const keycloakConfig: IKeyCloakConfig = {
    baseUrl:
      `${process.env.NX_AUTHENTICATION_SERVICE_URL}:${process.env.NX_AUTHETICATION_SERVICE_PORT}/${process.env.NX_AUTHENTICATION_SERVICE_REALM}/${process.env.NX_AUTHENTICATION_SERVICE_AUTH}` ||
      '',
    clientId: process.env.NX_AUTHENTICATION_SERVICE_CLIENT_ID || '',
    clientSecret: process.env.NX_AUTHENTICATION_SERVICE_CLIENT_SECRET || '',
    grantType: process.env.NX_AUTHENTICATION_SERVICE_GRANT_TYPE || '',
  };

  try {
    const identityProvider: IdentityProvider = new KeyCloakIdentityProvider(keycloakConfig);
    const authenticator: AuthenticationService = new AuthenticationService(identityProvider);
    const user: User = yield call(authenticator.login, credentials);
    yield put(AuthenticatorActions.authenticationSuccess(user));
  } catch (error) {
    yield put(AuthenticatorActions.authenticationFailure(error.messages));
  }
}

function* authenticationSaga() {
  yield takeEvery<IAuthenticateAction>(AUTHENTICATOR_ACTIONS.AUTHENTICATE, authenticate);
}

export function* authenticatorSaga() {
  yield all([authenticationSaga()]);
}

export default authenticatorSaga;
