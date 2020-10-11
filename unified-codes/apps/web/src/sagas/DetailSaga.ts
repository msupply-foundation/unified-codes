import { call, put, takeEvery, all, delay } from 'redux-saga/effects';

import {
  AlertSeverity,
  IEntity,
  IAlert,
} from '@unified-codes/data';

import {
  DETAIL_ACTIONS,
  DetailActions,
  AlertActions,
  IDetailUpdateEntityAction,
} from '../actions';


const ALERT_SEVERITY = {
  FETCH: AlertSeverity.info,
  ERROR: AlertSeverity.error,
};

const ALERT_TEXT = {
  FETCH: 'Fetching...',
  ERROR: 'Could not fetch entity.',
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

const getEntityQuery = (code: string) => `
{
  entity (code: "${code}") {
    code
    description
    type
    properties {
      type
      value
    }
    # form_category
    children {
      code
      description
      type
      # form
      children {
        code
        description
        type
        # unit_of_use
        children {
          code
          description
          type
        }
      }
    }
  }
}`;

const getEntity = async (
  url: string,
  code: string
): Promise<IEntity> => {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      query: getEntityQuery(code),
    }),
  });
  const json = await response.json();
  const { data } = json;
  const { entity } = data;
  return entity;
};

function* fetchDetails(action: IDetailUpdateEntityAction) {
  yield put(AlertActions.raiseAlert(alertFetch));
  try {
    const url = `${process.env.NX_DATA_SERVICE_URL}:${process.env.NX_DATA_SERVICE_PORT}/${process.env.NX_DATA_SERVICE_GRAPHQL}`;
    const { entity } = action;
    const { code } = entity;
    
    const updatedEntity: IEntity = yield call(getEntity, url, code);
    yield put(AlertActions.resetAlert());
    yield put(DetailActions.updateEntitySuccess(updatedEntity));
  } catch (error) {
    yield put(AlertActions.raiseAlert(alertError));
    yield put(DetailActions.updateEntityFailure(error));
  }
}

function* fetchDetailsSaga() {
  yield takeEvery<IDetailUpdateEntityAction>(DETAIL_ACTIONS.UPDATE_ENTITY, fetchDetails);
}


export function* detailsSaga() {
  yield all([fetchDetailsSaga()]);
}

export default detailsSaga;
