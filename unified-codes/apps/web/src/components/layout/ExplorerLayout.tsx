import * as React from 'react';

<<<<<<< HEAD:unified-codes/apps/web/src/components/layout/ExplorerLayout.tsx
import { Grid } from '@unified-codes/ui/components';
=======
import Grid from '../../layout/atoms/Grid';
import { Backdrop, CircularProgress } from '../../feedback';
>>>>>>> master:unified-codes/libs/ui/src/lib/components/entity/organisms/EntityBrowser.tsx

export interface ExplorerLayoutProps {
  root?: string;
  backdrop?: string;
  searchBarContainer?: string;
  tableContainer?: string;
  toggleBarContainer?: string;
}

<<<<<<< HEAD:unified-codes/apps/web/src/components/layout/ExplorerLayout.tsx
export interface ExplorerLayoutProps {
  classes?: {
      root?: string,
      toggleBarContainer?: string,
      searchBarContainer?: string,
      tableContainer?: string,
  };
=======
export interface IEntityBrowserProps {
  classes?: IEntityBrowserClasses;
  onMount: () => void;
  onUnmount: () => void;
  loading?: boolean;
>>>>>>> master:unified-codes/libs/ui/src/lib/components/entity/organisms/EntityBrowser.tsx
  table: React.ReactElement;
  toggleBar: React.ReactElement;
  searchBar: React.ReactElement;
}

export type ExplorerLayout = React.FunctionComponent<ExplorerLayoutProps>;

export const ExplorerLayout: ExplorerLayout = ({
  classes,
<<<<<<< HEAD:unified-codes/apps/web/src/components/layout/ExplorerLayout.tsx
=======
  loading,
  onMount,
  onUnmount,
>>>>>>> master:unified-codes/libs/ui/src/lib/components/entity/organisms/EntityBrowser.tsx
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
 