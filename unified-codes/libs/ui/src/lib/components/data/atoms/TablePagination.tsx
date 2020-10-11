import * as React from 'react';

import { TablePagination as MTablePagination, TablePaginationProps as MTablePaginationProps } from '@material-ui/core';

export type TablePaginationProps = MTablePaginationProps;

export type TablePagination = React.FunctionComponent<TablePaginationProps>;

export const TablePagination: TablePagination = (props) => <MTablePagination {...props}></MTablePagination>;

export default TablePagination;
