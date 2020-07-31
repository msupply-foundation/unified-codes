import * as React from "react";
import { makeStyles } from '@material-ui/core/styles';
import { Grid } from "../src/components";

export default { title: "Grid" };

const useStyles = makeStyles(() => ({
  parent: {
    borderStyle: "dashed",
    borderWidth: "thin",
  },
  child: {
    borderStyle: "dotted",
    borderWidth: "thin",
  }
}));

export const withDirectionRow = () => {
  const classes = useStyles();

  return (
    <Grid container className={classes.parent}>
      <Grid item className={classes.child}>Child 1</Grid>
      <Grid item className={classes.child}>Child 2</Grid>
      <Grid item className={classes.child}>Child 3</Grid>
    </Grid>
  )
};

export const withDirectionColumn = () => {
  const classes = useStyles();

  return (
    <Grid container direction="column" className={classes.parent}>
      <Grid item className={classes.child}>Child 1</Grid>
      <Grid item className={classes.child}>Child 2</Grid>
      <Grid item className={classes.child}>Child 3</Grid>
    </Grid>
  )
};