import * as React from 'react';
import { Table as MTable, TableProps as MTableProps } from '@material-ui/core';

export interface TableProps extends MTableProps {};

export type Table = React.FunctionComponent<TableProps>;

export const Table = (props: TableProps) => <MTable {...props}/>;