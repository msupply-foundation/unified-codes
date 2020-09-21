import * as React from 'react';

import {
  Table,
  TableHead,
  TableBody,
} from '../../data';

export interface EntityTableProps {
  classes?: {
    root?: string,
    head?: string,
    body?: string
  };
  header: React.ReactElement,
  rows: React.ReactElement,
}

export type EntityTable = React.FunctionComponent<EntityTableProps>;

export const EntityTable: EntityTable = ({
  classes,
  header,
  rows,
}: EntityTableProps) => {
 
  return (
    <Table classes={{ root: classes?.root }}>
      <TableHead classes={{ root: classes?.head }}>
        {header}
      </TableHead>
      <TableBody classes={{ root: classes?.body }}>
        {rows}
      </TableBody>
    </Table>
  );
};

export default EntityTable;