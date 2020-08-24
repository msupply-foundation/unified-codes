import { all } from 'redux-saga/effects';

import authenticatorSaga from './AuthenticatorSaga';
import explorerSaga from './ExplorerSaga';

export function* rootSaga() {
  yield all([authenticatorSaga(), explorerSaga()]);
}
