import * as React from 'react'
import { TableCell, TableHeadProps, TableRowProps } from '../../atoms';
import { TableHeader, TableHeaderProps } from '../../molecules';

export interface EntityTableHeaderProps extends TableHeaderProps {};

export type EntityTableHeader = React.FunctionComponent<EntityTableHeaderProps>;

export const EntityTableHeader: EntityTableHeader = ({ headProps, rowProps }: { headProps: TableHeadProps, rowProps: TableRowProps }) => {
    return (
        <TableHeader headProps={headProps} rowProps={rowProps}>
            <TableCell>Code</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Type</TableCell>
        </TableHeader>
    );
};