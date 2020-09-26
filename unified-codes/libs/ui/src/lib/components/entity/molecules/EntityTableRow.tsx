import * as React from 'react';

import { TableCell, TableCellProps, TableRow, TableRowProps } from '../../data';

import { IEntity, EEntityField } from '@unified-codes/data';

export interface IEntityTableRowClasses {
  root?: string,
  cell?: string,
}

// TODO: remove rowProps, cellProps.
export interface EntityTableRowProps  {
  classes?: IEntityTableRowClasses;
  columns: string[];
  entity: IEntity;
}

export type EntityTableRow = React.FunctionComponent<EntityTableRowProps>;

export const EntityTableRow: EntityTableRow = ({ classes, columns, entity }) => {
  const cells = columns.map(column => (
    <TableCell classes={{ root: classes?.cell }}>
      {entity[column as EEntityField]}
    </TableCell>
  ));

  return (
    <TableRow classes={{ root: classes?.root }}>
      {cells}
    </TableRow>
  );
};

export default EntityTableRow;
