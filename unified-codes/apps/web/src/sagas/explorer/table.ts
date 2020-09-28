import { call, put, takeEvery, all, select } from 'redux-saga/effects';

import {
  EEntityField,
  EEntityType,
  IEntity,
} from '@unified-codes/data';


import { ITableAction, TABLE_ACTIONS, TableActions } from '../../actions';
import { IExplorerState, IState } from '../../types';

interface IFetchEntitiesParameters {
    code?: string,
    description?: string,
    type?: EEntityType,
    orderBy?: EEntityField,
    orderDesc?: boolean,
    first?: number,
    offset?: number,
}

const getEntitiesQuery = ({ 
        code,
        description,
        type = EEntityType.MEDICINAL_PRODUCT, 
        orderBy = EEntityField.DESCRIPTION,
        orderDesc = false,
        first = 25, 
        offset = 0,
    }: IFetchEntitiesParameters) => `
  {
    entities(filter: { code: "${code}" description: "${description}" type: "${type}" orderBy: { field: "${orderBy}" descending: ${orderDesc} } } offset: ${offset} first: ${first}) {
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

  console.log("JSONNN", json);

  const { data } = json;
  const { entities } = data;

  return entities;
};

const getEntitiesParameters = (state: IState) => {
    const { explorer }: { explorer: IExplorerState } = state;
    const { searchBar, table } = explorer;

    const code = '';
    const description = searchBar?.input ?? '';
    const type = EEntityType.MEDICINAL_PRODUCT;
    const orderBy = table?.orderBy ?? EEntityField.DESCRIPTION;
    const orderDesc = table?.orderDesc ?? false;
    const first = table?.rowsPerPage ?? 25;
    const offset = (table?.page ? table.page - 1 : 0) * first;

    return {
        code,
        description,
        type,
        orderBy,
        orderDesc,
        first,
        offset
    };
}

function* fetchData() {
    console.log("TABLE SAGA GOGOGO");
  try {
    const url:
      | string
      | undefined = `${process.env.NX_DATA_SERVICE_URL}:${process.env.NX_DATA_SERVICE_PORT}/${process.env.NX_DATA_SERVICE_GRAPHQL}`;
    if (url) {
      const parameters = yield select(getEntitiesParameters);
      const entities: IEntity[] = yield call(getEntities, url, parameters);
      yield put(TableActions.fetchEntitiesSuccess(entities));
    }
  } catch {
      console.log("whoops");
  }
}

function* fetchDataSaga() {
  yield takeEvery<ITableAction>(TABLE_ACTIONS.FETCH_ENTITIES, fetchData);
}

export function* tableSaga() {
  yield all([fetchDataSaga()]);
}

export default tableSaga;
