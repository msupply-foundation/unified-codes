import * as React from 'react';

import { Grid, Typography } from '@unified-codes/ui/components';
import { makeStyles, createStyles } from '@unified-codes/ui/styles';

import { ITheme } from '../../../styles';

const CatOnBike = require('../../../assets/cat-on-bike.png');

const useStyles = makeStyles((_: ITheme) =>
  createStyles({
    root: {
      flexDirection: 'column',
      alignContent: 'center',
      padding: '20px 0 20px 0',
    },
    imageContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
    },
    image: {
      maxHeight: 'calc(100vh - 350px)',
      maxWidth: '100vw',
      padding: '20px 0 20px 0',
    },
    textContainer: {
      textAlign: 'center',
    },
  })
);

export interface ErrorNotFoundProps {}

export type ErrorNotFound = React.FunctionComponent<ErrorNotFoundProps>;

export const ErrorNotFound: ErrorNotFound = () => {
  const classes = useStyles();

  return (
    <Grid container className={classes.root}>
      <Grid item className={classes.textContainer}>
        <Typography variant="h3">Nothing to see here...</Typography>
      </Grid>
      <Grid container item className={classes.imageContainer}>
        <img className={classes.image} src={CatOnBike} />
      </Grid>
      <Grid item className={classes.textContainer}>
        <Typography variant="h3">...are you sure that you're in the right place?</Typography>
      </Grid>
    </Grid>
  );
};

export default ErrorNotFound;
