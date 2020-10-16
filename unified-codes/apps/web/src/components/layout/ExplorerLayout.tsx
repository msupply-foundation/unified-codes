import * as React from 'react';

import { Grid } from '@unified-codes/ui/components';

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
    toggleBarContainer?: string;
    searchBarContainer?: string;
    tableContainer?: string;
  };
  table: React.ReactElement;
  toggleBar: React.ReactElement;
  searchBar: React.ReactElement;
  progressBar: React.ReactElement;
}

export type ExplorerLayout = React.FunctionComponent<ExplorerLayoutProps>;

export const ExplorerLayout: ExplorerLayout = ({
  classes,
  searchBar,
  table,
  toggleBar,
  progressBar,
}) => {
  return (
    <Grid container direction="column" className={classes?.root}>
      <Grid item className={classes?.toggleBarContainer}>
        {toggleBar}
      </Grid>
      <Grid item className={classes?.searchBarContainer}>
        {searchBar}
      </Grid>
      <Grid item classes={{ root: classes?.tableContainer }}>
        {table}
      </Grid>
      {progressBar}
    </Grid>
  );
};

export default ExplorerLayout;
