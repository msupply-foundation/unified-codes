import * as React from 'react';

import Grid from '../../layout/atoms/Grid';

export interface IEntityBrowserClasses {
  root?: string;
  toggleBarContainer?: string,
  searchBarContainer?: string,
  tableContainer?: string,
}

export interface EntityBrowserProps {
  classes: IEntityBrowserClasses;
  table: React.ReactElement;
  toggleBar: React.ReactElement;
  searchBar: React.ReactElement;
}

export type EntityBrowser = React.FunctionComponent<EntityBrowserProps>;

export const EntityBrowser: EntityBrowser = ({
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

export default EntityBrowser;
