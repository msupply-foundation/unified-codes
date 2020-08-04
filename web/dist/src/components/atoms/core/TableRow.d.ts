import * as React from "react";
import { TableRowProps as MTableRowProps } from "@material-ui/core";
export interface TableRowProps extends MTableRowProps {}
export declare type TableRow = React.FunctionComponent<TableRowProps>;
export declare const TableRow: (props: TableRowProps) => JSX.Element;
