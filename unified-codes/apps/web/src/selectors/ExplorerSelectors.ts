import { createSelector } from 'reselect';

import { EEntityField, EEntityType, IEntity } from '@unified-codes/data';

import { IExplorerSearchBarState, IExplorerState, IExplorerTableState, IExplorerToggleBarState, IState } from '../types';

export const selectExplorer = (state: IState): IExplorerState => state.explorer;

export const selectSearchBar = createSelector(
    selectExplorer,
    (explorer: IExplorerState) => explorer?.searchBar
);

export const selectTable = createSelector(
    selectExplorer,
    (explorer: IExplorerState) => explorer?.table
);

export const selectToggleBar = createSelector(
    selectExplorer,
    (explorer: IExplorerState) => explorer?.toggleBar
);

export const selectInput = createSelector(
    selectSearchBar,
    (searchBar: IExplorerSearchBarState): string => searchBar?.input
);

export const selectLabel = createSelector(
    selectSearchBar,
    (searchBar: IExplorerSearchBarState): string => searchBar?.label
);

export const selectOrderBy = createSelector(
    selectTable,
    (table: IExplorerTableState): EEntityField => table?.orderBy
);

export const selectOrderDesc = createSelector(
    selectTable,
    (table: IExplorerTableState): boolean => table?.orderDesc
);

export const selectCount = createSelector(
    selectTable,
    (table: IExplorerTableState): number => table?.count
);

export const selectRowsPerPage = createSelector(
    selectTable,
    (table: IExplorerTableState): number => table?.rowsPerPage
)

export const selectPage = createSelector(
    selectTable,
    (table: IExplorerTableState): number => table?.page
)

export const selectEntities = createSelector(
    selectTable,
    (table: IExplorerTableState): IEntity[] => table?.entities
);

export const selectFilterByDrug = createSelector(
    selectToggleBar,
    (toggleBar: IExplorerToggleBarState): boolean => toggleBar?.[EEntityType.DRUG]
)

export const selectFilterByMedicinalProduct = createSelector(
    selectToggleBar,
    (toggleBar: IExplorerToggleBarState): boolean => toggleBar?.[EEntityType.MEDICINAL_PRODUCT]
)

export const selectFilterByOther = createSelector(
    selectToggleBar,
    (toggleBar: IExplorerToggleBarState): boolean => toggleBar?.[EEntityType.OTHER]
)

export const SearchBarSelectors = {
    selectInput,
    selectLabel,
};

export const TableSelectors = {
    selectOrderBy,
    selectOrderDesc,
    selectCount,
    selectRowsPerPage,
    selectPage,
    selectEntities
};

export const ToggleBarSelectors = {
    selectFilterByDrug,
    selectFilterByMedicinalProduct,
    selectFilterByOther
};

export const ExplorerSelectors = {
    ...SearchBarSelectors,
    ...TableSelectors,
    ...ToggleBarSelectors
}

export default ExplorerSelectors;
