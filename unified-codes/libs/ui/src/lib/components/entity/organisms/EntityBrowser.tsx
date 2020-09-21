import * as React from 'react';

import Grid from '../../layout/atoms/Grid';

export interface IEntityBrowserClasses {
  root?: string;
  typeFilterContainer?: string,
  searchBarContainer?: string,
  tableContainer?: string,
  tablePaginationContainer?: string,
}

export interface EntityBrowserProps {
  classes: IEntityBrowserClasses;
  table: React.ReactElement;
  typeFilter: React.ReactElement;
  searchBar: React.ReactElement;
  tablePagination: React.ReactElement;
}

export type EntityBrowser = React.FunctionComponent<EntityBrowserProps>;

export const EntityBrowser: EntityBrowser = ({
  classes,
  searchBar,
  table,
  tablePagination,
  typeFilter
}) => {
  return (
    <Grid container direction='column' className={classes?.root}>
        <Grid item className={classes?.typeFilterContainer}>
          {typeFilter}
        </Grid>
        <Grid item className={classes?.searchBarContainer}>
          {searchBar}
        </Grid>
      <Grid item classes={{ root: classes?.tableContainer }}>
          {table}
      </Grid>
      <Grid item classes={{ root: classes?.tablePaginationContainer }}>
        {tablePagination}
      </Grid>
    </Grid>
  );
};

export default EntityBrowser;
