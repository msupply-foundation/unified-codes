import * as React from 'react';

import { Backdrop, CircularProgress, Grid } from '@unified-codes/ui/components';

export interface ExplorerLayoutProps {
  root?: string;
  backdrop?: string;
  searchBarContainer?: string;
  tableContainer?: string;
  toggleBarContainer?: string;
}

export interface ExplorerLayoutProps {
  classes?: {
    root?: string;
    backdrop?: string;
    searchBarContainer?: string;
    tableContainer?: string;
    toggleBarContainer?: string;
  };
  loading?: boolean;
  table: React.ReactElement;
  toggleBar: React.ReactElement;
  searchBar: React.ReactElement;
}

export type ExplorerLayout = React.FunctionComponent<ExplorerLayoutProps>;

export const ExplorerLayout: ExplorerLayout = ({
  classes,
  loading,
  searchBar,
  table,
  toggleBar,
}) => {
  return (
    <Grid container direction="column" className={classes?.root}>
      <Backdrop className={classes?.backdrop} open={loading || false}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Grid item className={classes?.toggleBarContainer}>
        {toggleBar}
      </Grid>
      <Grid item className={classes?.searchBarContainer}>
        {searchBar}
      </Grid>
      <Grid item classes={{ root: classes?.tableContainer }}>
        {table}
      </Grid>
    </Grid>
  );
};

export default ExplorerLayout;
