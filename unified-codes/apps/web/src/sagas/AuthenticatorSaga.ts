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

  // TODO: should get this from env, as previously!
  const keycloakConfig: IKeyCloakConfig = {
    baseUrl: process.env.AUTHENTICATION_URL || '',
    clientId: process.env.CLIENT_ID || '',
    clientSecret: process.env.CLIENT_SECRET || '',
    grantType: '',
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
