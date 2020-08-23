import { all } from 'redux-saga/effects';

import sagas from './sagas';

export function* rootSaga() {
  yield all([sagas()]);
}
