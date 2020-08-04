import * as React from "react";
import {
  TableBody as MTableBody,
  TableBodyProps as MTableBodyProps,
} from "@material-ui/core";

export interface TableBodyProps extends MTableBodyProps {}

export type TableBody = React.FunctionComponent<TableBodyProps>;

export const TableBody = (props: TableBodyProps) => <MTableBody {...props} />;
