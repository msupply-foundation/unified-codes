import { IExplorerState } from '../types';
import { EEntityField, EEntityType } from '@unified-codes/data';
import {
  EXPLORER_ACTIONS,
  IExplorerAction,
  IExplorerSearchBarUpdateFilterByAction,
  IExplorerSearchBarUpdateInputAction,
  IExplorerTableFetchEntitiesSuccessAction,
  IExplorerTableUpdateOrderByAction,
  IExplorerTableUpdateOrderDescAction,
} from '../actions';

const initialState: IExplorerState = {
  searchBar: {
    input: '',
    filterBy: EEntityField.DESCRIPTION,
  },
  table: {
    entities: [],
    count: 0,
    loading: false,
    orderBy: EEntityField.DESCRIPTION,
    orderDesc: false,
    rowsPerPage: 25,
    page: 0,
  },
  toggleBar: {
    [EEntityType.DRUG]: true,
    [EEntityType.MEDICINAL_PRODUCT]: false,
    [EEntityType.OTHER]: false,
  },
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
      return { ...state, table: { ...state.table, orderBy, orderDesc } };
    }

    case EXPLORER_ACTIONS.UPDATE_ORDER_DESC: {
      const { orderDesc } = action as IExplorerTableUpdateOrderDescAction;
      return { ...state, table: { ...state.table, orderDesc } };
    }

    case EXPLORER_ACTIONS.UPDATE_ENTITIES: {
      return { ...state, table: { ...state.table, loading: true } };
    }

    case EXPLORER_ACTIONS.UPDATE_ENTITIES_SUCCESS: {
      const { entities } = action as IExplorerTableFetchEntitiesSuccessAction;
      const { data, totalLength } = entities;
      return {
        ...state,
        table: { ...state.table, entities: data, count: totalLength, loading: false },
      };
    }

    case EXPLORER_ACTIONS.UPDATE_ENTITIES_FAILURE: {
      return { ...state, table: { ...state.table, loading: false } };
    }

    case EXPLORER_ACTIONS.UPDATE_INPUT: {
      const { input } = action as IExplorerSearchBarUpdateInputAction;
      return { ...state, searchBar: { ...state.searchBar, input } };
    }

    case EXPLORER_ACTIONS.RESET_INPUT: {
      return { ...state, searchBar: { ...state.searchBar, input: initialState.searchBar.input } };
    }

    case EXPLORER_ACTIONS.UPDATE_FILTER_BY: {
      const { filterBy } = action as IExplorerSearchBarUpdateFilterByAction;
      return { ...state, searchBar: { ...state.searchBar, filterBy } };
    }

    case EXPLORER_ACTIONS.RESET_FILTER_BY: {
      return {
        ...state,
        searchBar: { ...state.searchBar, filterBy: initialState.searchBar.filterBy },
      };
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
      return { ...state, table: { ...state.table, rowsPerPage: initialState.table.rowsPerPage } };
    }

    case EXPLORER_ACTIONS.TOGGLE_FILTER_BY_DRUG: {
      return {
        ...state,
        toggleBar: { ...state.toggleBar, [EEntityType.DRUG]: !state.toggleBar[EEntityType.DRUG] },
      };
    }

    case EXPLORER_ACTIONS.TOGGLE_FILTER_BY_MEDICINAL_PRODUCT: {
      return {
        ...state,
        toggleBar: {
          ...state.toggleBar,
          [EEntityType.MEDICINAL_PRODUCT]: !state.toggleBar[EEntityType.MEDICINAL_PRODUCT],
        },
      };
    }

    case EXPLORER_ACTIONS.TOGGLE_FILTER_BY_OTHER: {
      return {
        ...state,
        toggleBar: { ...state.toggleBar, [EEntityType.OTHER]: !state.toggleBar[EEntityType.OTHER] },
      };
    }

  return state;
};

export default ExplorerReducer;
