import * as React from "react";
import { TableCellProps as MTableCellProps } from "@material-ui/core";
export interface TableCellProps extends MTableCellProps {}
export declare type TableCell = React.FunctionComponent<TableCellProps>;
export declare const TableCell: (props: TableCellProps) => JSX.Element;
