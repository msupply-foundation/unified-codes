import { call, put, takeEvery, all } from 'redux-saga/effects';

import {
  AlertSeverity,
  Entity,
  IAlert,
  IPaginatedResults,
  IEntitySearchFilter,
  IEntitySearchRequest,
} from '@unified-codes/data';

import {
  EXPLORER_ACTIONS,
  ExplorerActions,
  AlertActions,
  IExplorerAction,
  IExplorerFetchDataAction,
} from '../actions';

const getEntitiesQuery = (filter: IEntitySearchFilter, first: number, offset?: number) => `
  {
    entities(filter: { code: "${filter.code}" description: "${filter.description}" type: "${filter.type}" } offset: ${offset} first: ${first}) {
      entities {
        code
        description
        type
      },
      hasMore,
      totalResults,
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
const getEntities = async (
  url: string,
  request: IEntitySearchRequest
): Promise<IPaginatedResults<Entity>> => {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      query: getEntitiesQuery(request.filter, request.first, request.offset),
    }),
  });
  const json = await response.json();
  const { data } = json;
  const { entities } = data;

  return entities;
};

function* fetchData(action: IExplorerFetchDataAction) {
  yield put(AlertActions.raiseAlert(alertFetch));
  try {
    const url:
      | string
      | undefined = `${process.env.NX_DATA_SERVICE_URL}:${process.env.NX_DATA_SERVICE_PORT}/${process.env.NX_DATA_SERVICE_GRAPHQL}`;
    if (url) {
      const data: IPaginatedResults<Entity> = yield call(getEntities, url, action.request);

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
