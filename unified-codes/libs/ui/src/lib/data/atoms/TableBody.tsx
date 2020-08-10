import * as React from "react";

import { TableBody as MTableBody, TableBodyProps as MTableBodyProps } from "@material-ui/core";

export type TableBodyProps = MTableBodyProps;

export type TableBody = React.FunctionComponent<TableBodyProps>;

export const TableBody: TableBody = props => <MTableBody {...props}></MTableBody>;

export default TableBody;