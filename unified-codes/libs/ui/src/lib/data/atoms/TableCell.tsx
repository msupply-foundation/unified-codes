import * as React from 'react';

import { TableCell as MTableCell, TableCellProps as MTableCellProps } from '@material-ui/core';

export type TableCellProps = MTableCellProps;

export type TableCell = React.FunctionComponent<TableCellProps>;

export const TableCell: TableCell = (props) => <MTableCell {...props}></MTableCell>;

export default TableCell;
