import * as React from 'react';
import { TableHead as MTableHead, TableHeadProps as MTableHeadProps } from '@material-ui/core';

export interface TableHeadProps extends MTableHeadProps {};

export type TableHead = React.FunctionComponent<TableHeadProps>;

export const TableHead = (props: TableHeadProps) => <MTableHead {...props}/>;