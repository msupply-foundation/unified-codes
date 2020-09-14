import { call, put, takeEvery, all } from 'redux-saga/effects';

import {
  AlertSeverity,
  Entity,
  EntitySearchFilter,
  EntitySearchRequest,
  IAlert,
  IEntityCollection,
  IEntitySearchFilter,
  IEntitySearchRequest,
} from '@unified-codes/data';

import {
  EXPLORER_ACTIONS,
  ExplorerActions,
  AlertActions,
  IExplorerAction,
  IExplorerFetchDataAction,
  IExplorerUpdateVariablesAction,
} from '../actions';

const getEntitiesQuery = (
  filter: IEntitySearchFilter,
  first: number,
  orderBy: string,
  orderDesc: boolean,
  offset?: number
) => `
  {
    entities(filter: { code: "${filter.code}" description: "${filter.description}" type: "${filter.type}" orderBy: "${orderBy}" orderDesc: ${orderDesc} } offset: ${offset} first: ${first}) {
      data {
        code
        description
        type
        uid
      },
      hasMore,
      totalLength,
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
): Promise<IEntityCollection> => {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      query: getEntitiesQuery(
        request.filter,
        request.first,
        request.filter.orderBy,
        request.filter.orderDesc,
        request.offset
      ),
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
      const entities: IEntityCollection = yield call(getEntities, url, action.request);
      yield put(AlertActions.resetAlert());
      yield put(ExplorerActions.fetchSuccess(entities));
    }
  } catch (error) {
    yield put(AlertActions.raiseAlert(alertError));
    yield put(ExplorerActions.fetchFailure(error));
  }
}

function* fetchDataSaga() {
  yield takeEvery<IExplorerAction>(EXPLORER_ACTIONS.FETCH_DATA, fetchData);
}

function* updateVariables(action: IExplorerUpdateVariablesAction) {
  const { variables } = action;
  const { code, description, page, rowsPerPage, orderDesc, orderBy, type } = variables;
  const filter = new EntitySearchFilter(description, code, type, orderBy, orderDesc);
  const request = new EntitySearchRequest(filter, rowsPerPage, page);
  yield put(ExplorerActions.fetchData(request));
}

function* updateVariablesSaga() {
  yield takeEvery<IExplorerUpdateVariablesAction>(
    EXPLORER_ACTIONS.UPDATE_VARIABLES,
    updateVariables
  );
}

export function* explorerSaga() {
  yield all([fetchDataSaga(), updateVariablesSaga()]);
}

export default explorerSaga;
