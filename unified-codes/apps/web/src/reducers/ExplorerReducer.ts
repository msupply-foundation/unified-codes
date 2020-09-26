import {
  EXPLORER_ACTIONS,
  IExplorerAction,
  IExplorerUpdateVariablesAction,
  IExplorerFetchFailureAction,
  IExplorerFetchSuccessAction,
} from '../actions';
import { IExplorerState } from '../types';
import { EntityCollection, EEntityField, EEntityType } from '@unified-codes/data';

const initialState = (): IExplorerState => {
  return {
    entities: new EntityCollection(),
    loading: false,
    variables: {
      orderBy: 'description',
      page: 0,
      rowsPerPage: 25,
      type: 'medicinal_product',
    },
    searchBar: {
      input: '',
      label: 'Search description',
    },
    table: {
      count: 1,
      entities: [{ code: 'A', description: 'Drug A', type: 'medicinal_product' }],
      orderBy: EEntityField.DESCRIPTION,
      orderDesc: false,
      rowsPerPage: 25,
      page: 1,
    },
    toggleBar: {
      buttonTypes: [EEntityType.DRUG, EEntityType.UNIT_OF_USE, EEntityType.OTHER],
      buttonStates: { [EEntityType.DRUG]: true, [EEntityType.UNIT_OF_USE]: false, [EEntityType.OTHER]: false }
    }
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
