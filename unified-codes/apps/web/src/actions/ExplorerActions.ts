import { Action } from 'redux';
import { Entity, IPaginationRequest, IPaginatedResults } from '@unified-codes/data';

export const EXPLORER_ACTIONS = {
  FETCH_DATA: 'explorerActions/fetchData',
  FETCH_SUCCESS: 'explorerActions/fetchSuccess',
  FETCH_FAILURE: 'explorerActions/fetchFailure',
  RESET_DATA: 'explorerActions/resetData',
  UPDATE_VARIABLES: 'explorerActions/updateVariables',
  RESET_VARIABLES: 'explorerActions/resetVariables',
};

export interface IExplorerFetchDataAction extends Action<string> {
  request: IPaginationRequest;
}

export interface IExplorerFetchSuccessAction extends Action<string> {
  entities: IPaginatedResults<Entity>;
}

export interface IExplorerFetchFailureAction extends Action<string> {
  error: Error;
}

export interface IExplorerResetDataAction extends Action<string> {}

export interface IExplorerUpdateVariablesAction extends Action<string> {
  variables: object;
}

export type IExplorerAction =
  | IExplorerFetchDataAction
  | IExplorerResetDataAction
  | IExplorerFetchFailureAction
  | IExplorerUpdateVariablesAction;

export const fetchData = (request: IPaginationRequest) => ({
  type: EXPLORER_ACTIONS.FETCH_DATA,
  request,
});

export const fetchSuccess = (entities: IPaginatedResults<Entity>) => ({
  type: EXPLORER_ACTIONS.FETCH_SUCCESS,
  entities,
});

export const fetchFailure = (error: Error) => ({
  type: EXPLORER_ACTIONS.FETCH_FAILURE,
  error,
});

export const resetData = () => ({
  type: EXPLORER_ACTIONS.RESET_DATA,
});

export const updateVariables = (variables: object) => ({
  type: EXPLORER_ACTIONS.UPDATE_VARIABLES,
  variables,
});

export const resetVariables = () => ({
  type: EXPLORER_ACTIONS.RESET_VARIABLES,
});

export const ExplorerActions = {
  fetchData,
  fetchSuccess,
  fetchFailure,
  resetData,
  updateVariables,
  resetVariables,
};

export default ExplorerActions;
