import * as React from "react";

import { TableHead as MTableHead, TableHeadProps as MTableHeadProps } from "@material-ui/core";

export type TableHeadProps = MTableHeadProps;

export type TableHead = React.FunctionComponent<TableHeadProps>;

export const TableHead: TableHead = props => <MTableHead {...props}></MTableHead>;

export default TableHead;