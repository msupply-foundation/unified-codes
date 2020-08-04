import * as React from "react";
import { TableHeadProps, TableRowProps } from "../../atoms";
export interface TableHeaderProps {
  headProps: TableHeadProps;
  rowProps: TableRowProps;
}
export declare type TableHeader = React.FunctionComponent<TableHeaderProps>;
export declare const TableHeader: ({
  headProps,
  rowProps,
  children,
}: {
  headProps: TableHeadProps;
  rowProps: TableRowProps;
  children: React.ReactElement[];
}) => JSX.Element;
