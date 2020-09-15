import * as React from 'react';

import { TableCell, TableCellProps, TableRow, TableRowProps } from '../../data';

import { IEntity } from '@unified-codes/data';

export interface EntityTableRowProps {
  rowProps?: TableRowProps;
  cellProps?: TableCellProps;
  entity?: IEntity;
}

export type EntityTableRow = React.FunctionComponent<EntityTableRowProps>;

export const EntityTableRow: EntityTableRow = ({ rowProps, cellProps, entity }) => {
  const { code, description, type } = entity || {};
  return (
    <TableRow {...rowProps}>
      <TableCell {...cellProps}>{code}</TableCell>
      <TableCell {...cellProps}>{description}</TableCell>
      <TableCell {...cellProps}>{type}</TableCell>
    </TableRow>
  );
};

export default EntityTableRow;
