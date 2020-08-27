import * as React from 'react';
import { makeStyles } from '@material-ui/core';

import Grid from './Grid';

const useStyles = makeStyles(() => ({
  parent: {
    borderStyle: 'dashed',
    borderWidth: 'thin',
  },
  child: {
    borderStyle: 'dotted',
    borderWidth: 'thin',
  },
}));

export default {
  component: Grid,
  title: 'Library/Grid',
};

export const withNoProps = () => {
  return <Grid>Hello Grid!</Grid>;
};

export const withDirectionRow = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const classes = useStyles();

  return (
    <Grid container className={classes.parent}>
      <Grid item className={classes.child}>
        Child 1
      </Grid>
      <Grid item className={classes.child}>
        Child 2
      </Grid>
      <Grid item className={classes.child}>
        Child 3
      </Grid>
    </Grid>
  );
};

export const withDirectionColumn = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const classes = useStyles();

  return (
    <Grid container direction="column" className={classes.parent}>
      <Grid item className={classes.child}>
        Child 1
      </Grid>
      <Grid item className={classes.child}>
        Child 2
      </Grid>
      <Grid item className={classes.child}>
        Child 3
      </Grid>
    </Grid>
  );
};
