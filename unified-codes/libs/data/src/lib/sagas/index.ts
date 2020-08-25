import { all } from 'redux-saga/effects';
import { userSagas } from './UserSagas';

export function* rootSaga() {
  yield all([userSagas()]);
}
