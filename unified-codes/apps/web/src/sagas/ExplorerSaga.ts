import { call, put, takeEvery, all, select } from 'redux-saga/effects';

import {
  AlertSeverity,
  EEntityField,
  EEntityType,
  IAlert,
  IEntity,
} from '@unified-codes/data';

import { AlertActions, ExplorerActions, EXPLORER_ACTIONS, IExplorerAction } from '../actions';
import { IExplorerState, IState } from '../types';
import { ExplorerSelectors } from '../selectors';

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

interface IFetchEntitiesParameters {
  code?: string,
  description?: string,
  types?: EEntityType[],
  orderBy?: EEntityField,
  orderDesc?: boolean,
  first?: number,
  offset?: number,
}

const getEntitiesQuery = ({
  code,
  description,
  types = [EEntityType.MEDICINAL_PRODUCT],
  orderBy = EEntityField.DESCRIPTION,
  orderDesc = false,
  first = 25,
  offset = 0,
}: IFetchEntitiesParameters) => `
  {
    entities(filter: { code: "${code}" description: "${description}" type: "${types}" orderBy: { field: "${orderBy}" descending: ${orderDesc} } } offset: ${offset} first: ${first}) {
      data {
        code
        description
        type
        uid
      },
      totalLength,
    }
  }
`;

const getEntities = async (
  url: string,
  parameters: IFetchEntitiesParameters
): Promise<IEntity[]> => {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      query: getEntitiesQuery(parameters),
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

      const first = rowsPerPage;
      const offset = rowsPerPage * (page - 1);

      const parameters: IFetchEntitiesParameters = {
        code,
        description,
        types,
        orderBy,
        orderDesc,
        first,
        offset
      }
 
      const entities = yield call(getEntities, url, parameters);
      yield put(ExplorerActions.updateEntitiesSuccess(entities));
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
