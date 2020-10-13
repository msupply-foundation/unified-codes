import * as React from 'react';

import {
  Grid,
  Table,
} from '@unified-codes/ui/components';

export interface ExplorerTableLayoutProps {
  classes?: {
    root?: string,
    table?: string,
    tableContainer?: string
  };
  header: React.ReactElement,
  pagination: React.ReactElement,
  rows: React.ReactElement,
}

export type ExplorerTableLayout = React.FunctionComponent<ExplorerTableLayoutProps>;

export const ExplorerTableLayout: ExplorerTableLayout = ({
  classes,
  header,
  pagination,
  rows,
}) => (
    <Grid container classes={{ root: classes?.root }}>
      <Grid container item classes={{ root: classes?.tableContainer }}>
        <Table classes={{ root: classes?.table }}>
            {header}
            {rows}
            {pagination}
        </Table>
      </Grid>
    </Grid>
  );

export default ExplorerTableLayout;