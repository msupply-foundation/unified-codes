import { Action } from 'redux';

import { EEntityField, IEntity } from '@unified-codes/data';

export const TABLE_ACTIONS = {
  FETCH_ENTITIES: 'explorer/table/fetchEntities',
  FETCH_ENTITIES_SUCCESS: 'explorer/table/fetchEntitiesSuccess',
  FETCH_ENTITIES_FAILURE: 'explorer/table/fetchEntitiesFailure',
  UPDATE_FILTER_BY: 'explorer/table/updateFilterBy',
  UPDATE_ORDER_BY: 'explorer/table/updateOrderBy',
  UPDATE_ORDER_DESC: 'explorer/table/updateOrderDesc',
  UPDATE_ROWS_PER_PAGE: 'explorer/table/updateRowsPerPage',
  UPDATE_PAGE: 'explorer/table/updatePage',
};

export interface ITableUpdateRowsPerPageAction extends Action<string> {
    rowsPerPage: number;
}

export interface ITableUpdatePageAction extends Action<string> {
    page: number;
}

export interface ITableUpdateOrderByAction extends Action<string> {
  orderBy: EEntityField;
}

export interface ITableUpdateOrderDescAction extends Action<string> {
  orderDesc: boolean;
}

export interface ITableUpdateFilterByAction extends Action<string> {
  filterBy: string;
}

export interface ITableFetchEntitiesAction extends Action<string> {};

export interface ITableFetchEntitiesSuccessAction extends Action<string> {
  entities: { data: IEntity[], totalLength: number };
};

export interface ITableFetchEntitiesFailureAction extends Action<string> {
  error: Error;
};

export type ITableAction =
  ITableUpdateRowsPerPageAction | 
  ITableUpdatePageAction |
  ITableUpdateOrderByAction |
  ITableUpdateOrderDescAction |
  ITableUpdateFilterByAction |
  ITableFetchEntitiesAction |
  ITableFetchEntitiesSuccessAction |
  ITableFetchEntitiesFailureAction;

const updateRowsPerPage = (rowsPerPage: number) => ({
    type: TABLE_ACTIONS.UPDATE_ROWS_PER_PAGE,
    rowsPerPage,
});

const updatePage = (page: number) => ({
    type: TABLE_ACTIONS.UPDATE_PAGE,
    page,
})

const updateFilterBy = (filterBy: string) => ({
    type: TABLE_ACTIONS.UPDATE_FILTER_BY,
    filterBy,
})

const updateOrderBy = (orderBy: EEntityField) => ({
  type: TABLE_ACTIONS.UPDATE_ORDER_BY,
  orderBy,
});

const updateOrderDesc = (orderDesc: boolean) => ({
    type: TABLE_ACTIONS.UPDATE_ORDER_DESC,
    orderDesc,
});

export const fetchEntities = () => ({
  type: TABLE_ACTIONS.FETCH_ENTITIES
});

export const fetchEntitiesSuccess = (entities: IEntity[]) => ({
  type: TABLE_ACTIONS.FETCH_ENTITIES_SUCCESS,
  entities,
});

export const fetchEntitiesFailure = (error: Error) => ({
  type: TABLE_ACTIONS.FETCH_ENTITIES_FAILURE,
  error,
});

export const TableActions = {
  updateOrderBy,
  updateOrderDesc,
  updateFilterBy,
  updatePage,
  updateRowsPerPage,
  fetchEntities,
  fetchEntitiesSuccess,
  fetchEntitiesFailure,
};

export default TableActions;
