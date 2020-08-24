import {
  EXPLORER_ACTIONS,
  IExplorerAction,
  IExplorerUpdateVariablesAction,
  IExplorerFetchFailureAction,
  IExplorerFetchSuccessAction,
} from '../actions';
import { IExplorerState } from '../types';

const initialState = (): IExplorerState => {
  return {
    loading: false,
    variables: {},
  };
};

export const ExplorerReducer = (state = initialState(), action: IExplorerAction) => {
  const { type } = action;

  switch (type) {
    case EXPLORER_ACTIONS.FETCH_DATA: {
      return { ...state, loading: true };
    }

    case EXPLORER_ACTIONS.FETCH_SUCCESS: {
      const { data } = action as IExplorerFetchSuccessAction;
      return { ...state, data, loading: false };
    }

    case EXPLORER_ACTIONS.FETCH_FAILURE: {
      const { error } = action as IExplorerFetchFailureAction;
      return { ...state, error, loading: false };
    }

    case EXPLORER_ACTIONS.RESET_DATA: {
      return { ...state, data: [] };
    }

    case EXPLORER_ACTIONS.UPDATE_VARIABLES: {
      const { variables } = action as IExplorerUpdateVariablesAction;
      return { ...state, variables };
    }

    case EXPLORER_ACTIONS.RESET_VARIABLES: {
      return { ...state, variables: {} };
    }

    default:
      return state;
  }
};

export default ExplorerReducer;
