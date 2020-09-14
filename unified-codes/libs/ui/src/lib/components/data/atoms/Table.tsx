import * as React from 'react';

import { Table as MTable, TableProps as MTableProps } from '@material-ui/core';

export type TableProps = MTableProps & { alternatingRowColour?: string; stripedRows?: boolean };

export type Table = React.FunctionComponent<TableProps>;

export const Table: Table = (props) => <MTable {...props}></MTable>;

export default Table;
