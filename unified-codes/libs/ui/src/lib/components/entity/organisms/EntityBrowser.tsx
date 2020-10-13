import * as React from 'react';

import Grid from '../../layout/atoms/Grid';
import { Backdrop, CircularProgress } from '../../feedback';

export interface IEntityBrowserClasses {
  root?: string;
  backdrop?: string;
  searchBarContainer?: string;
  tableContainer?: string;
  toggleBarContainer?: string;
}

export interface IEntityBrowserProps {
  classes?: IEntityBrowserClasses;
  onMount: () => void;
  onUnmount: () => void;
  loading?: boolean;
  table: React.ReactElement;
  toggleBar: React.ReactElement;
  searchBar: React.ReactElement;
}

export type EntityBrowser = React.FunctionComponent<IEntityBrowserProps>;

export const EntityBrowser: EntityBrowser = ({
  classes,
  loading,
  onMount,
  onUnmount,
  searchBar,
  table,
  toggleBar,
}) => {
  React.useEffect(() => {
    onMount();
    return onUnmount;
  }, []);

  return (
    <Grid container direction="column" className={classes?.root}>
      <Backdrop className={classes?.backdrop} open={loading}>
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

export default EntityBrowser;
