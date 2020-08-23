import { call, put, takeEvery, all } from 'redux-saga/effects';

import { IEntity, AlertSeverity, IAlert } from '@unified-codes/data';

import { EXPLORER_ACTIONS, ExplorerActions, AlertActions, IExplorerAction } from '../actions';

const GET_ENTITIES = `
  {
    entities {
      code
      description
      type
    }
  }
`;

const ALERT_SEVERITY = {
  FETCH: AlertSeverity.info,
  ERROR: AlertSeverity.error,
};

const ALERT_TEXT = {
  FETCH: 'Fetching...',
  ERROR: 'Could not fetch data.',
};

const alertError: IAlert = {
  isVisible: true,
  severity: ALERT_SEVERITY.ERROR,
  text: ALERT_TEXT.ERROR,
};

const alertFetch: IAlert = {
  isVisible: true,
  severity: ALERT_SEVERITY.FETCH,
  text: ALERT_TEXT.FETCH,
};

// TODO: add helper class for raw gql queries to data library and refactor this!
const getEntities = async (url: string): Promise<IEntity[]> => {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({ query: GET_ENTITIES }),
  });
  const json = await response.json();
  const { data }: { data: { entities: IEntity[] } } = json;
  const { entities }: { entities: IEntity[] } = data;
  return entities;
};

function* fetchData() {
  yield put(AlertActions.raiseAlert(alertFetch));

  try {
    const url: string | undefined = process.env.NX_DATA_SERVICE;
    if (url) {
      const data: IEntity[] = yield call(getEntities, url);
      yield put(AlertActions.resetAlert());
      yield put(ExplorerActions.fetchSuccess(data));
    }
  } catch (error) {
    yield put(AlertActions.raiseAlert(alertError));
    yield put(ExplorerActions.fetchFailure(error));
  }
}

function* fetchDataSaga() {
  yield takeEvery<IExplorerAction>(EXPLORER_ACTIONS.FETCH_DATA, fetchData);
}

export function* explorerSaga() {
  yield all([fetchDataSaga()]);
}

export default explorerSaga;
