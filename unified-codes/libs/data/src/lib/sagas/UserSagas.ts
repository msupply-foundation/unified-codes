import { call, put, takeEvery, all } from 'redux-saga/effects';
import { UserActions, USER_ACTIONS, IUserAuthenticationAction } from '../actions';
import { authenticate } from '../api';

function* login(action: IUserAuthenticationAction) {
  try {
    const { auth } = action;
    const response = yield call(authenticate, auth);
    const user = {
      isAuthenticated: true,
      loggingIn: false,
      name: response.access_token,
      roles: [],
    };
    yield put(UserActions.loginSuccess(user));
  } catch (error) {
    yield put(UserActions.loginFailure(error.messages));
  }
}

function* userAuthenticationSaga() {
  yield takeEvery<IUserAuthenticationAction>(USER_ACTIONS.LOG_IN, login);
}

export function* userSagas() {
  yield all([userAuthenticationSaga()]);
}
