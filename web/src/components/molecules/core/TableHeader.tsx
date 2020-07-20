import * as React from 'react';
import { TableHead, TableHeadProps, TableRow, TableRowProps } from '../../atoms';

export interface TableHeaderProps {
    headProps?: TableHeadProps,
    rowProps?: TableRowProps,
};

export type TableHeader = React.FunctionComponent<TableHeaderProps>;

export const TableHeader = ({ headProps, rowProps, children }: { headProps: TableHeadProps, rowProps: TableRowProps, children: React.ReactElement[] }) => (
    <TableHead {...headProps}>
        <TableRow {...rowProps}>
            {children}
        </TableRow>
    </TableHead>
);