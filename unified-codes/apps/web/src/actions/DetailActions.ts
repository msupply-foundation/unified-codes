import { IEntity } from 'libs/data/src/lib';
import { Action } from 'redux';

export const DETAIL_ACTIONS = {
  FETCH_ENTITY: 'detail/fetchEntity',
  UPDATE_ENTITY: 'detail/updateEntity',
  UPDATE_ENTITY_SUCCESS: 'detail/updateEntitySuccess',
  UPDATE_ENTITY_FAILURE: 'detail/updateEntityFailure',
};

export interface IDetailFetchEntityAction extends Action<string> {
  code: string;
}

export interface IDetailUpdateEntityAction extends Action<string> {
  entity: IEntity;
}

export interface IDetailUpdateSuccessAction extends Action<string> {
  entity: IEntity;
}

export interface IDetailUpdateFailureAction extends Action<string> {
  error: Error;
}

export type IDetailAction =
  | IDetailFetchEntityAction
  | IDetailUpdateEntityAction
  | IDetailUpdateSuccessAction
  | IDetailUpdateFailureAction;

const fetchEntity = (code: string) => ({
  type: DETAIL_ACTIONS.FETCH_ENTITY,
  code,
});

const updateEntity = (entity: IEntity) => ({
  type: DETAIL_ACTIONS.UPDATE_ENTITY,
  entity,
});

const updateEntitySuccess = (entity: IEntity) => ({
  type: DETAIL_ACTIONS.UPDATE_ENTITY_SUCCESS,
  entity,
});

const updateEntityFailure = (error: Error) => ({
  type: DETAIL_ACTIONS.UPDATE_ENTITY_FAILURE,
  error,
});

export const DetailActions = {
  fetchEntity,
  updateEntity,
  updateEntitySuccess,
  updateEntityFailure,
};

export default DetailActions;
