
import { IExplorerSearchBarState, IExplorerState, IExplorerTableState, IExplorerToggleBarState } from '../types';
import { EEntityField, EEntityType } from '@unified-codes/data';
import { EXPLORER_ACTIONS, IExplorerAction, IExplorerTableFetchEntitiesSuccessAction } from '../actions';

const initialSearchBarState = (): IExplorerSearchBarState => ({
  input: '',
  label: 'Search description',
});

const initialTableState = (): IExplorerTableState => ({
  entities: [],
  count: 0,
  loading: false,
  orderBy: EEntityField.DESCRIPTION,
  orderDesc: false,
  rowsPerPage: 25,
  page: 0,
});

const initialToggleBarState = (): IExplorerToggleBarState => ({
  buttonTypes: [EEntityType.DRUG, EEntityType.MEDICINAL_PRODUCT, EEntityType.OTHER],
  buttonStates: { [EEntityType.DRUG]: true, [EEntityType.MEDICINAL_PRODUCT]: false, [EEntityType.OTHER]: false }
});

const initialState = (): IExplorerState => ({
  searchBar: initialSearchBarState(),
  table: initialTableState(),
  toggleBar: initialToggleBarState()
});

export const ExplorerReducer = (
  state = initialState(),
  action: IExplorerAction
): IExplorerState => {
  const { type } = action;

  switch (type) {
    case EXPLORER_ACTIONS.FETCH_ENTITIES_SUCCESS: {
      const { entities } = action as IExplorerTableFetchEntitiesSuccessAction;
      const { data, totalLength } = entities;
      return { ...state, table: { ...state.table, entities: data, count: totalLength }};
    }
  }

    return state;
};

export default ExplorerReducer;
