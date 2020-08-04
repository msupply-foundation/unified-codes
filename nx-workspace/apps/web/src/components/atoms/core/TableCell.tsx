import * as React from "react";
import {
  TableCell as MTableCell,
  TableCellProps as MTableCellProps,
} from "@material-ui/core";

export interface TableCellProps extends MTableCellProps {}

export type TableCell = React.FunctionComponent<TableCellProps>;

export const TableCell = (props: TableCellProps) => <MTableCell {...props} />;
