import { createSelector } from 'reselect';

import { IState, IExplorerTableState } from '../../types';
import { EEntityField, IEntity } from '@unified-codes/data';

export const selectTable = (state: IState): IExplorerTableState => state.explorer.table;

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

export const TableSelectors = {
    selectOrderBy,
    selectOrderDesc,
    selectCount,
    selectRowsPerPage,
    selectPage,
    selectEntities
};

export default TableSelectors;
