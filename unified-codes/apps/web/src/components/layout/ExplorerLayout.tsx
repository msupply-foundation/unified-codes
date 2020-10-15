import * as React from 'react';

import { Grid } from '@unified-codes/ui/components';

export interface ExplorerLayoutProps {
  root?: string;
  toggleBarContainer?: string,
  searchBarContainer?: string,
  tableContainer?: string,
}

export interface ExplorerLayoutProps {
  classes?: {
      root?: string,
      toggleBarContainer?: string,
      searchBarContainer?: string,
      tableContainer?: string,
  };
  table: React.ReactElement;
  toggleBar: React.ReactElement;
  searchBar: React.ReactElement;
}

export type ExplorerLayout = React.FunctionComponent<ExplorerLayoutProps>;

export const ExplorerLayout: ExplorerLayout = ({
  classes,
  searchBar,
  table,
  toggleBar
}) => {
  return (
    <Grid container direction='column' className={classes?.root}>
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
 