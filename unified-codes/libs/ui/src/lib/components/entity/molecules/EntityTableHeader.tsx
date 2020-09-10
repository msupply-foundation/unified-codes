import * as React from 'react';

import { TableCell, TableCellProps, TableRow, TableRowProps } from '../../data';

export interface EntityTableHeaderProps {
  rowProps?: TableRowProps;
  cellProps?: TableCellProps;
  onSort?: (value: string) => void;
}

export type EntityTableHeader = React.FunctionComponent<EntityTableHeaderProps>;

export const EntityTableHeader: EntityTableHeader = ({
  rowProps,
  cellProps,
  onSort,
}: {
  rowProps: TableRowProps;
  cellProps: TableCellProps;
  onSort?: (value: string) => void;
}) => {
  const handleSortCode = () => onSort && onSort('code');
  const handleSortDescription = () => onSort && onSort('description');
  const handleSortType = () => onSort && onSort('type');
  const mergedCellProps = { ...cellProps, style: { cursor: 'pointer' } };

  return (
    <TableRow {...rowProps}>
      <TableCell {...mergedCellProps} onClick={handleSortCode}>
        Code
      </TableCell>
      <TableCell {...mergedCellProps} onClick={handleSortDescription}>
        Description
      </TableCell>
      <TableCell {...mergedCellProps} onClick={handleSortType}>
        Type
      </TableCell>
    </TableRow>
  );
};

export default EntityTableHeader;
