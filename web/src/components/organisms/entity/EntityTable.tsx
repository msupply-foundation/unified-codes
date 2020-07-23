import * as React from 'react'
import { Table, TableProps, TableHead, TableHeadProps, TableBody, TableBodyProps } from '../../atoms';
import { EntityTableHeader, EntityTableHeaderProps, EntityTableRow, EntityTableRowProps } from '../../molecules';
import { Entity } from '../../../types';

export interface EntityTableProps {
    tableProps?: TableProps,
    headProps?: TableHeadProps, 
    headerProps?: EntityTableHeaderProps,
    bodyProps?: TableBodyProps,
    rowProps?: EntityTableRowProps,
    entities: Entity[],
};

export type EntityTable = React.FunctionComponent<EntityTableProps>;

export const EntityTable: EntityTable = ({ tableProps, headProps, headerProps, bodyProps, rowProps, entities }: { tableProps: TableProps, headProps: TableHeadProps, headerProps: EntityTableHeaderProps, bodyProps: TableBodyProps, rowProps: EntityTableRowProps, entities: Entity[] }) => {
    const mapEntity = (entity: Entity) => <EntityTableRow {...{...rowProps, entity}}></EntityTableRow>;
    
    const EntityTableRows = React.useCallback(() => (
        <React.Fragment>{entities.map(mapEntity)}</React.Fragment>
    ), [rowProps, entities]);
    
    return (
        <Table {...tableProps}>
            <TableHead {...headProps}>
                <EntityTableHeader {...headerProps}/>
            </TableHead>
            <TableBody {...bodyProps}>
                <EntityTableRows/>
            </TableBody>
        </Table>
    );
};