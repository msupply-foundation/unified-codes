import { IEntity } from 'libs/data/src/lib';
import { Action } from 'redux';

export const DETAIL_ACTIONS = {
  UPDATE_ENTITY: 'detail/updateEntity',
  FETCH_ENTITY: 'detail/fetchEntity',
  FETCH_ENTITY_SUCCESS: 'detail/fetchEntitySuccess',
  FETCH_ENTITY_FAILURE: 'detail/fetchEntityFailure',
};

export interface IDetailUpdateEntityAction extends Action<string> {
  entity: IEntity;
}

export interface IDetailFetchEntityAction extends Action<string> {
  code: string;
}

export interface IDetailFetchSuccessAction extends Action<string> {
  entity: IEntity;
}

export interface IDetailFetchFailureAction extends Action<string> {
  error: Error;
}

export type IDetailAction =
  | IDetailUpdateEntityAction
  | IDetailFetchEntityAction
  | IDetailFetchSuccessAction
  | IDetailFetchFailureAction;

const updateEntity = (entity: IEntity) => ({
  type: DETAIL_ACTIONS.UPDATE_ENTITY,
  entity,
});

const fetchEntity = (code: string) => ({
  type: DETAIL_ACTIONS.FETCH_ENTITY,
  code,
});

const fetchEntitySuccess = (entity: IEntity) => ({
  type: DETAIL_ACTIONS.FETCH_ENTITY_SUCCESS,
  entity,
});

const fetchEntityFailure = (error: Error) => ({
  type: DETAIL_ACTIONS.FETCH_ENTITY_FAILURE,
  error,
});

export const DetailActions = {
  updateEntity,
  fetchEntity,
  fetchEntitySuccess,
  fetchEntityFailure,
};

export default DetailActions;
