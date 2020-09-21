import {
  EXPLORER_ACTIONS,
  IExplorerAction,
  IExplorerUpdateVariablesAction,
  IExplorerFetchFailureAction,
  IExplorerFetchSuccessAction,
} from '../actions';
import { IExplorerState } from '../types';
import { EntityCollection } from '@unified-codes/data';

const initialState = (): IExplorerState => {
  return {
    entities: new EntityCollection(),
    loading: false,
    variables: {
      orderBy: 'description',
      page: 0,
      rowsPerPage: 25,
      type: 'drug',
    },
  };
};

export const ExplorerReducer = (
  state = initialState(),
  action: IExplorerAction
): IExplorerState => {
  const { type } = action;

  switch (type) {
    case EXPLORER_ACTIONS.FETCH_DATA: {
      return { ...state, loading: true };
    }

    case EXPLORER_ACTIONS.FETCH_SUCCESS: {
      const { entities } = action as IExplorerFetchSuccessAction;
      return { ...state, entities, loading: false };
    }

    case EXPLORER_ACTIONS.FETCH_FAILURE: {
      const { error } = action as IExplorerFetchFailureAction;
      return { ...state, error, loading: false };
    }

    case EXPLORER_ACTIONS.RESET_DATA: {
      return { ...state, entities: initialState().entities };
    }

    case EXPLORER_ACTIONS.UPDATE_VARIABLES: {
      const { variables } = action as IExplorerUpdateVariablesAction;
      return { ...state, variables };
    }

    case EXPLORER_ACTIONS.RESET_VARIABLES: {
      return { ...state, variables: initialState().variables };
    }

    default:
      return state;
  }
};

export default ExplorerReducer;
