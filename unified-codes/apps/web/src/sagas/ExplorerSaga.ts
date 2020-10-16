import { call, put, takeEvery, all, select } from 'redux-saga/effects';

import { AlertSeverity, IAlert, IEntity } from '@unified-codes/data';

import { AlertActions, ExplorerActions, EXPLORER_ACTIONS, IExplorerAction } from '../actions';
import { ExplorerSelectors } from '../selectors';
import { ExplorerQuery, IExplorerParameters } from '../types';

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

const getEntities = async (url: string, query: ExplorerQuery): Promise<IEntity[]> => {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      query: String(query),
    }),
  });

  const json = await response.json();

  const { data } = json;
  const { entities } = data;

  return entities;
};

function* fetchData() {
  yield put(AlertActions.raiseAlert(alertFetch));
  try {
    const url:
      | string
      | undefined = `${process.env.NX_DATA_SERVICE_URL}:${process.env.NX_DATA_SERVICE_PORT}/${process.env.NX_DATA_SERVICE_GRAPHQL}`;
    if (url) {
      const code = yield select(ExplorerSelectors.selectCode);
      const description = yield select(ExplorerSelectors.selectDescription);
      const types = yield select(ExplorerSelectors.selectTypes);
      const orderBy = yield select(ExplorerSelectors.selectOrderBy);
      const orderDesc = yield select(ExplorerSelectors.selectOrderDesc);
      const rowsPerPage = yield select(ExplorerSelectors.selectRowsPerPage);
      const page = yield select(ExplorerSelectors.selectPage);

      const parameters: IExplorerParameters = {
        code,
        description,
        types,
        orderBy,
        orderDesc,
        rowsPerPage,
        page,
      };

      const query = new ExplorerQuery(parameters);

      const entities = yield call(getEntities, url, query);

      yield put(ExplorerActions.updateEntitiesSuccess(entities));
      yield put(AlertActions.resetAlert());
    }
  } catch (error) {
    yield put(AlertActions.raiseAlert(alertError));
    yield put(ExplorerActions.updateEntitiesFailure(error));
  }
}

function* fetchEntitiesSaga() {
  yield takeEvery<IExplorerAction>(EXPLORER_ACTIONS.UPDATE_ENTITIES, fetchData);
}

export function* explorerSaga() {
  yield all([fetchEntitiesSaga()]);
}

export default explorerSaga;
