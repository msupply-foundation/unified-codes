
import { IExplorerState } from '../types';
import { EntityCollection, EEntityField, EEntityType } from '@unified-codes/data';
import { ISearchBarAction, ITableAction, ITableFetchEntitiesSuccessAction, IToggleBarAction, TABLE_ACTIONS } from '../actions';

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
      entities: [],
      orderBy: EEntityField.DESCRIPTION,
      orderDesc: false,
      rowsPerPage: 25,
      page: 1,
    },
    toggleBar: {
      buttonTypes: [EEntityType.DRUG, EEntityType.MEDICINAL_PRODUCT, EEntityType.OTHER],
      buttonStates: { [EEntityType.DRUG]: true, [EEntityType.MEDICINAL_PRODUCT]: false, [EEntityType.OTHER]: false }
    }
  };
};

export const ExplorerReducer = (
  state = initialState(),
  action: ITableAction | IToggleBarAction | ISearchBarAction
): IExplorerState => {
  const { type } = action;

  switch (type) {
    case TABLE_ACTIONS.FETCH_ENTITIES_SUCCESS: {
      const { entities } = action as ITableFetchEntitiesSuccessAction;
      const { data, totalLength } = entities;
      return { ...state, table: { ...state.table, entities: data, count: totalLength }};
    }
  }

    return state;
};

export default ExplorerReducer;
