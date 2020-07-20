import * as React from 'react';
import { TableRow as MTableRow, TableRowProps as MTableRowProps } from '@material-ui/core';

export interface TableRowProps extends MTableRowProps {};

export type TableRow = React.FunctionComponent<TableRowProps>;

export const TableRow = (props: TableRowProps) => <MTableRow {...props}/>;