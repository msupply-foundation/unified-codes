import { TableFooter, TableRow } from '@material-ui/core';
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
    <Grid container classes={{ root: classes?.root }}>
      <Grid container item classes={{ root: classes?.tableContainer }}>
        <Table classes={{ root: classes?.root }}>
          <TableHead classes={{ root: classes?.head }}>
            {header}
          </TableHead>
          <TableBody classes={{ root: classes?.body }}>
            {rows}
          </TableBody>
          <TableFooter classes={{ root: classes?.paginationContainer }}>
            <TableRow>
              {pagination}
            </TableRow>
          </TableFooter>
        </Table>
      </Grid>

    </Grid>
  );
};

export default EntityTable;