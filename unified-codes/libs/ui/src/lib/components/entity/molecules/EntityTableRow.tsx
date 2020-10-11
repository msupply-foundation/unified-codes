import * as React from 'react';

import { TableCell, TableRow } from '../../data';

import { IEntity, EEntityField } from '@unified-codes/data';

export interface IEntityTableRowClasses {
  root?: string,
  cell?: string,
}

// TODO: remove rowProps, cellProps.
export interface IEntityTableRowProps  {
  classes?: IEntityTableRowClasses;
  columns: string[];
  entity: IEntity;
  onSelect: (entity: IEntity) => void;
}

export type EntityTableRow = React.FunctionComponent<IEntityTableRowProps>;

export const EntityTableRow: EntityTableRow = ({ classes, columns, entity, onSelect }) => {
  const onClick = React.useCallback(() => onSelect(entity), [entity, onSelect]);

  const cells = columns.map(column => (
    <TableCell key={column} classes={{ root: classes?.cell }}>
      {entity[column as EEntityField]}
    </TableCell>
  ));

  return (
    <TableRow classes={{ root: classes?.root }} onClick={onClick}>
      {cells}
    </TableRow>
  );
};

export default EntityTableRow;
