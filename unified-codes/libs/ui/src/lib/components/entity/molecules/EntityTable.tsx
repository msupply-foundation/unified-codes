import * as React from 'react';

import {
  Table,
  TableHead,
  TableBody,
} from '../../data';

import { Grid } from '../../layout/atoms';

export interface EntityTableProps {
  classes?: {
    body?: string,
    head?: string,
    paginationContainer?: string,
    root?: string,
    tableContainer?: string
  };
  header: React.ReactElement,
  pagination: React.ReactElement,
  rows: React.ReactElement,
}

export type EntityTable = React.FunctionComponent<EntityTableProps>;

export const EntityTable: EntityTable = ({
  classes,
  header,
  pagination,
  rows,
}: EntityTableProps) => {
 
  return (
    <Grid classes={{ root: classes?.root }}>
      <Grid classes={{ root: classes?.tableContainer }}>
        <Table classes={{ root: classes?.root }}>
          <TableHead classes={{ root: classes?.head }}>
            {header}
          </TableHead>
          <TableBody classes={{ root: classes?.body }}>
            {rows}
          </TableBody>
        </Table>
      </Grid>
      <Grid item classes={{ root: classes?.paginationContainer }}>
        {pagination}
      </Grid>
    </Grid>
  );
};

export default EntityTable;