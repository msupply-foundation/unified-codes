import * as React from 'react';

import { Grid } from '@unified-codes/ui/components';

export interface ErrorLayoutProps {
  classes?: {
      root?: string;
      topContainer?: string;
      centerContainer?: string;
      bottomContainer?: string;
  };
  top: React.ReactElement,
  center: React.ReactElement,
  bottom: React.ReactElement,
}

export type ErrorLayout = React.FunctionComponent<ErrorLayoutProps>;

export const ErrorLayout: ErrorLayout = ({
  classes,
  top,
  center,
  bottom
}) => (
    <Grid container className={classes?.root}>
        <Grid item className={classes?.topContainer}>
            {top}
        </Grid>
        <Grid container item className={classes?.centerContainer}>
            {center}
        </Grid>
        <Grid item className={classes?.bottomContainer}>
            {bottom}
        </Grid>
    </Grid> 
  );

export default ErrorLayout;