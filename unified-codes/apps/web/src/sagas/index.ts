import { all } from 'redux-saga/effects';

import authenticatorSaga from './AuthenticatorSaga';
import explorerSaga from './ExplorerSaga';
import detailsSaga from './DetailsSaga';

export function* rootSaga() {
  yield all([authenticatorSaga(), explorerSaga(), detailsSaga()]);
}
