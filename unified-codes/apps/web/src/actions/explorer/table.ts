import { Action } from 'redux';

import { EEntityField } from '@unified-codes/data';

export const TABLE_ACTIONS = {
  UPDATE_FILTER_BY: 'explorer/table/updateFilterBy',
  UPDATE_ORDER_BY: 'explorer/table/updateOrderBy',
  UPDATE_ORDER_DESC: 'explorer/table/updateOrderDesc',
  UPDATE_ROWS_PER_PAGE: 'explorer/table/updateRowsPerPage',
  UPDATE_PAGE: 'explorer/table/updatePage',
  UPDATE_DATA: 'explorer/table/updateData'
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

export interface ITableUpdateData extends Action<string> {};

export type ITableAction =
  ITableUpdateRowsPerPageAction | 
  ITableUpdatePageAction |
  ITableUpdateOrderByAction |
  ITableUpdateOrderDescAction |
  ITableUpdateFilterByAction |
  ITableUpdateData;

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

const updateData = () => ({
  type: TABLE_ACTIONS.UPDATE_DATA
});

export const TableActions = {
  updateOrderBy,
  updateOrderDesc,
  updateFilterBy,
  updatePage,
  updateRowsPerPage,
  updateData,
};

export default TableActions;