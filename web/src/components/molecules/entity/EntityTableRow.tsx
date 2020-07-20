import * as React from 'react'
import { TableRow, TableCell } from '../../atoms';
import { Entity } from '../../../types';

export interface EntityTableRowProps {
    entity: Entity,
};

export type EntityTableRow = React.FunctionComponent<EntityTableRowProps>;

export const EntityTableRow: EntityTableRow = ({ entity }) => {
    const { code, description, type } = entity;
    return (
     <TableRow>
         <TableCell>{code}</TableCell>
         <TableCell>{description}</TableCell>
         <TableCell>{type}</TableCell>
     </TableRow>
    );
};