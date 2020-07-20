import * as React from 'react'
import { TableCell, TableCellProps, TableHead, TableHeadProps, TableRow, TableRowProps } from '../../atoms';

export interface EntityTableHeaderProps {
    headProps?: TableHeadProps,
    rowProps?: TableRowProps,
    cellProps?: TableCellProps,
};

export type EntityTableHeader = React.FunctionComponent<EntityTableHeaderProps>;

export const EntityTableHeader: EntityTableHeader = ({ headProps, rowProps, cellProps }: { headProps: TableHeadProps, rowProps: TableRowProps, cellProps: TableCellProps }) => {
    return (
        <TableHead {...headProps}>
            <TableRow {...rowProps}>
                <TableCell {...cellProps}>Code</TableCell>
                <TableCell {...cellProps}>Description</TableCell>
                <TableCell {...cellProps}>Type</TableCell>
            </TableRow>
        </TableHead>
    );
};