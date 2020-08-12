import * as React from 'react';

import { TableCell, TableCellProps, TableRow, TableRowProps } from '@unified-codes/ui';

export interface EntityTableHeaderProps {
  rowProps?: TableRowProps;
  cellProps?: TableCellProps;
}

export type EntityTableHeader = React.FunctionComponent<EntityTableHeaderProps>;

export const EntityTableHeader: EntityTableHeader = ({
  rowProps,
  cellProps,
}: {
  rowProps: TableRowProps;
  cellProps: TableCellProps;
}) => {
  return (
    <TableRow {...rowProps}>
      <TableCell {...cellProps}>Code</TableCell>
      <TableCell {...cellProps}>Description</TableCell>
      <TableCell {...cellProps}>Type</TableCell>
    </TableRow>
  );
};

export default EntityTableHeader;
