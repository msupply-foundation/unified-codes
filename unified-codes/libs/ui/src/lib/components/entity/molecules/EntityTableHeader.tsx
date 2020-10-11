import * as React from 'react';

import { TableCell, TableCellProps, TableRow, TableRowProps } from '../../data';
import { ArrowUpIcon } from '../../icons';

export interface EntityTableHeaderProps {
  classes?: {
    root?: string;
    row?: string,
    cell?: string,
  }
  columns: string[];
  orderDesc?: boolean;
  orderBy?: string;
  onSort?: (value: string) => void;
}

export type EntityTableHeader = React.FunctionComponent<EntityTableHeaderProps>;

export const EntityTableHeader: EntityTableHeader = ({
  classes,
  columns,
  orderDesc,
  orderBy,
  onSort,
}: EntityTableHeaderProps) => {
  // TODO: presentational components should expose styles to parent.
  const arrowStyle = orderDesc
    ? { marginBottom: -7, transform: 'rotate(180deg)' }
    : { marginBottom: -7 };

  // TODO: presentational components should expose all UI conditions to parent.
  const headerCells = columns.map((column: string) => {
    const onClick = () => onSort && onSort(column);
    const sortIcon = orderBy === column ? <ArrowUpIcon style={arrowStyle} /> : null;
    return (
      <TableCell classes={{ root: classes?.cell }} key={column} onClick={onClick}>
        {column}
        {sortIcon}  
      </TableCell>
    );
  })

  return (
    <TableRow classes={{ root: classes?.row }}>
      {headerCells}
    </TableRow>
  );
};

export default EntityTableHeader;
