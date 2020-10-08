import { all } from 'redux-saga/effects';

import authenticatorSaga from './AuthenticatorSaga';
import explorerSaga from './ExplorerSaga';
import detailSaga from './DetailSaga';

export function* rootSaga() {
  yield all([authenticatorSaga(), explorerSaga(), detailSaga()]);
}
