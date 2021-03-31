import { createSelector } from 'reselect';

import { EEntityField, IEntity, EEntityCategory } from '@unified-codes/data/v1';

import {
  IExplorerSearchBarState,
  IExplorerState,
  IExplorerTableState,
  IExplorerToggleBarState,
  IState,
} from '../types';

const selectExplorer = (state: IState): IExplorerState => state.explorer;

const selectSearchBar = createSelector(
  selectExplorer,
  (explorer: IExplorerState) => explorer?.searchBar
);

const selectTable = createSelector(selectExplorer, (explorer: IExplorerState) => explorer?.table);

const selectToggleBar = createSelector(
  selectExplorer,
  (explorer: IExplorerState) => explorer?.toggleBar
);

const selectInput = createSelector(
  selectSearchBar,
  (searchBar: IExplorerSearchBarState): string => searchBar?.input
);

const selectFilterBy = createSelector(
  selectSearchBar,
  (searchBar: IExplorerSearchBarState): EEntityField => searchBar?.filterBy
);

const selectLabel = createSelector(selectFilterBy, (filterBy: EEntityField): string => {
  switch (filterBy) {
    case EEntityField.CODE:
      return 'Search by code';
    case EEntityField.DESCRIPTION:
      return 'Search by description';
    default:
      return '';
  }
});

const selectCode = createSelector(
  selectInput,
  selectFilterBy,
  (input: string, filterBy: EEntityField) => (filterBy === EEntityField.CODE ? input : '')
);

const selectDescription = createSelector(
  selectInput,
  selectFilterBy,
  (input: string, filterBy: EEntityField) => (filterBy === EEntityField.DESCRIPTION ? input : '')
);

const selectOrderBy = createSelector(
  selectTable,
  (table: IExplorerTableState): EEntityField => table?.orderBy
);

const selectOrderDesc = createSelector(
  selectTable,
  (table: IExplorerTableState): boolean => table?.orderDesc
);

const selectCount = createSelector(
  selectTable,
  (table: IExplorerTableState): number => table?.count
);

const selectRowsPerPage = createSelector(
  selectTable,
  (table: IExplorerTableState): number => table?.rowsPerPage
);

const selectPage = createSelector(selectTable, (table: IExplorerTableState): number => table?.page);

const selectEntities = createSelector(
  selectTable,
  (table: IExplorerTableState): IEntity[] => table?.entities
);

const selectFilterByDrug = createSelector(
  selectToggleBar,
  (toggleBar: IExplorerToggleBarState): boolean => toggleBar?.[EEntityCategory.DRUG]
);

const selectFilterByConsumable = createSelector(
  selectToggleBar,
  (toggleBar: IExplorerToggleBarState): boolean => toggleBar?.[EEntityCategory.CONSUMABLE]
);

const selectFilterByOther = createSelector(
  selectToggleBar,
  (toggleBar: IExplorerToggleBarState): boolean => toggleBar?.[EEntityCategory.OTHER]
);

const selectCategories = createSelector(
  selectToggleBar,
  (toggleBar: IExplorerToggleBarState): (EEntityCategory.DRUG | EEntityCategory.CONSUMABLE | EEntityCategory.OTHER)[] =>
    Object.keys(toggleBar).filter((category: EEntityCategory.DRUG | EEntityCategory.CONSUMABLE | EEntityCategory.OTHER) =>
      toggleBar[category]) as (EEntityCategory.DRUG | EEntityCategory.CONSUMABLE | EEntityCategory.OTHER)[]
);

const selectLoading = createSelector(
  selectTable,
  (table: IExplorerTableState): boolean => table?.loading || false
);

export const SearchBarSelectors = {
  selectFilterBy,
  selectInput,
  selectLabel,
};

export const TableSelectors = {
  selectCode,
  selectCount,
  selectDescription,
  selectEntities,
  selectLoading,
  selectOrderBy,
  selectOrderDesc,
  selectPage,
  selectRowsPerPage,
  selectCategories,
};

export const ToggleBarSelectors = {
  selectFilterByDrug,
  selectFilterByConsumable,
  selectFilterByOther,
};

export const ExplorerSelectors = {
  ...SearchBarSelectors,
  ...TableSelectors,
  ...ToggleBarSelectors,
};

export default ExplorerSelectors;
