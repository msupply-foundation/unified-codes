import * as React from 'react';

import Grid from '../../layout/atoms/Grid';

export interface IEntityBrowserClasses {
  root?: string;
  toggleBarContainer?: string,
  searchBarContainer?: string,
  tableContainer?: string,
}

export interface IEntityBrowserProps {
  classes?: IEntityBrowserClasses;
  onMount: () => void;
  onUnmount: () => void;
  table: React.ReactElement;
  toggleBar: React.ReactElement;
  searchBar: React.ReactElement;
}

export type EntityBrowser = React.FunctionComponent<IEntityBrowserProps>;

export const EntityBrowser: EntityBrowser = ({
  classes,
  onMount,
  onUnmount,
  searchBar,
  table,
  toggleBar
}) => {
  React.useEffect(() => {
    onMount();
    return onUnmount;
  }, []);

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
