import * as React from 'react';

import { TableCell, TableCellProps, TableRow, TableRowProps } from '../../data';
import { ArrowUpIcon } from '../../icons';

export interface EntityTableHeaderProps {
  cellProps?: TableCellProps;
  orderDesc?: boolean;
  orderBy?: string;
  rowProps?: TableRowProps;
  onSort?: (value: string) => void;
}

export type EntityTableHeader = React.FunctionComponent<EntityTableHeaderProps>;

export const EntityTableHeader: EntityTableHeader = ({
  cellProps,
  orderDesc,
  orderBy,
  rowProps,
  onSort,
}: EntityTableHeaderProps) => {
  const mergedCellProps = { ...cellProps, style: { cursor: 'pointer', padding: '3px 16px' } };

  const Cell = ({ name }: { name: string }) => {
    const sortName = name.toLowerCase();
    const onClick = () => onSort && onSort(sortName);
    const arrowStyle = orderDesc
      ? { marginBottom: -7, transform: 'rotate(180deg)' }
      : { marginBottom: -7 };
    return (
      <TableCell {...mergedCellProps} onClick={onClick}>
        {name}
        {sortName === orderBy && <ArrowUpIcon style={arrowStyle} />}
      </TableCell>
    );
  };
  return (
    <TableRow {...rowProps}>
      <Cell name="Code" />
      <Cell name="Description" />
      <Cell name="Type" />
    </TableRow>
  );
};

export default EntityTableHeader;
