import { all } from 'redux-saga/effects';

import authenticatorSaga from './AuthenticatorSaga';
import tableSaga from './explorer/table';

export function* rootSaga() {
  yield all([authenticatorSaga(), tableSaga()]);
}
