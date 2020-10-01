
import { IExplorerSearchBarState, IExplorerState, IExplorerTableState, IExplorerToggleBarState } from '../types';
import { EEntityField, EEntityType } from '@unified-codes/data';
import { EXPLORER_ACTIONS, IExplorerAction, IExplorerSearchBarUpdateInputAction, IExplorerTableFetchEntitiesSuccessAction, IExplorerTableUpdateOrderByAction, IExplorerTableUpdateOrderDescAction } from '../actions';

const initialState: IExplorerState = {
  searchBar: {
    input: '',
    label: 'Search description'
  },
  table: {
    entities: [],
    count: 0,
    loading: false,
    filterBy: '',
    orderBy: EEntityField.DESCRIPTION,
    orderDesc: false,
    rowsPerPage: 25,
    page: 0,
  },
  toggleBar: {
    buttonTypes: [EEntityType.DRUG, EEntityType.MEDICINAL_PRODUCT, EEntityType.OTHER],
    buttonStates: { [EEntityType.DRUG]: true, [EEntityType.MEDICINAL_PRODUCT]: false, [EEntityType.OTHER]: false }
  }
};

export const ExplorerReducer = (
  state = { ...initialState },
  action: IExplorerAction
): IExplorerState => {
  const { type } = action;

  switch (type) {
    case EXPLORER_ACTIONS.UPDATE_ORDER_BY: {
      const { orderBy } = action as IExplorerTableUpdateOrderByAction;    
      const orderDesc = orderBy === state.table.orderBy && !state.table.orderDesc;
      return { ...state, table: { ...state.table, orderBy, orderDesc }};
    }

    case EXPLORER_ACTIONS.UPDATE_ORDER_DESC: {
      const { orderDesc } = action as IExplorerTableUpdateOrderDescAction;
      return { ...state, table: { ...state.table, orderDesc }};
    }

    case EXPLORER_ACTIONS.UPDATE_ENTITIES_SUCCESS: {
      const { entities } = action as IExplorerTableFetchEntitiesSuccessAction;
      const { data, totalLength } = entities;
      return { ...state, table: { ...state.table, entities: data, count: totalLength } };
    }

    case EXPLORER_ACTIONS.UPDATE_INPUT: {
      const { input } = action as IExplorerSearchBarUpdateInputAction;
      return { ...state, searchBar: { ...state.searchBar, input }}
    }

    case EXPLORER_ACTIONS.RESET_INPUT: {
      return { ...state, searchBar: { ...state.searchBar, input: initialState.searchBar.input } };
    }

    case EXPLORER_ACTIONS.RESET_LABEL: {
      return { ...state, searchBar: { ...state.searchBar, label: initialState.searchBar.label } };
    }

    case EXPLORER_ACTIONS.RESET_FILTER_BY: {
      return { ...state, table: { ...state.table, filterBy: initialState.table.filterBy } };
    }

    case EXPLORER_ACTIONS.RESET_ORDER_BY: {
      return { ...state, table: { ...state.table, orderBy: initialState.table.orderBy } };
    }

    case EXPLORER_ACTIONS.RESET_ENTITIES: {
      return { ...state, table: { ...state.table, entities: initialState.table.entities } };
    }

    case EXPLORER_ACTIONS.RESET_PAGE: {
      return { ...state, table: { ...state.table, page: initialState.table.page } };
    }

    case EXPLORER_ACTIONS.RESET_ROWS_PER_PAGE: {
      return { ...state, table: { ...state.table, rowsPerPage: initialState.table.rowsPerPage }};
    }
  }

  return state;
};

export default ExplorerReducer;
