import { Action } from 'redux';
import {
  IEntity,
} from '@unified-codes/data';

export const DETAILS_ACTIONS = {
  FETCH_ENTITY: 'detailsActions/fetchEntity',
  FETCH_SUCCESS: 'detailsActions/fetchSuccess',
  FETCH_FAILURE: 'detailsActions/fetchFailure',
};

export interface IDetailsFetchEntityAction extends Action<string> {
  code: string;
}

export interface IDetailsFetchSuccessAction extends Action<string> {
  entity: IEntity;
}

export interface IDetailsFetchFailureAction extends Action<string> {
  error: Error;
}

export type IDetailsAction =
  | IDetailsFetchEntityAction
  | IDetailsFetchSuccessAction
  | IDetailsFetchFailureAction

export const fetchEntity = (code: string) => ({
  type: DETAILS_ACTIONS.FETCH_ENTITY,
  code,
});

export const fetchEntitySuccess = (entity: IEntity) => ({
  type: DETAILS_ACTIONS.FETCH_SUCCESS,
  entity,
});

export const fetchEntityFailure = (error: Error) => ({
  type: DETAILS_ACTIONS.FETCH_FAILURE,
  error,
});


export const DetailsActions = {
  fetchEntity,
  fetchEntitySuccess,
  fetchEntityFailure,
};

export default DetailsActions;
