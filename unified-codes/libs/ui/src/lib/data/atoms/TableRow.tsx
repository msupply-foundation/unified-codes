import * as React from "react";

import { TableRow as MTableRow, TableRowProps as MTableRowProps } from "@material-ui/core";

export type TableRowProps = MTableRowProps;

export type TableRow = React.FunctionComponent<TableRowProps>;

export const TableRow: TableRow = props => <MTableRow {...props}></MTableRow>;

export default TableRow;