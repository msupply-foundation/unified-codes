import * as React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Link from '@material-ui/core/Link';
import { Theme, withStyles } from '@material-ui/core/styles';
import { ClassNameMap } from '@material-ui/core/styles/withStyles';

import { AppBar, Grid, UCIcon, Typography } from '@unified-codes/ui';

export interface HeaderProps {
  classes: ClassNameMap<any>;
}

type textAlignment = 'center' | 'left' | 'right';
const getStyles = (theme: Theme) => ({
  root: {
    backgroundColor: theme.palette.divider,
    padding: 24,
    paddingTop: 29,
  },
  body: theme.typography.body1,
  logo: {
    fontWeight: 700,
  },
  menu: {
    marginLeft: 50,
    '& div': {
      paddingRight: 15,
    },
    '& a': {
      color: 'rgba(255,255,255,0.83)',
      fontSize: 14,
      textTransform: 'uppercase',
    },
  },
  title1: {
    paddingRight: '0!important',
    ...theme.typography.subtitle1,
  },
  title2: {
    paddingLeft: '3px!important',
    ...theme.typography.subtitle2,
  },
  wrapper: {
    height: 60,
    justifyContent: 'space-evenly',
  },
});

export type Header = React.FunctionComponent<HeaderProps>;

const _Header: Header = ({ classes }) => {
  return (
    <AppBar position="static" className={classes.root}>
      <Grid
        container
        spacing={3}
        direction="column"
        alignContent="flex-start"
        alignItems="center"
        className={classes.wrapper}
      >
        <Grid item className={classes.title1}>
          Universal Drug
        </Grid>
        <Grid item style={{ paddingLeft: 0, paddingRight: 0 }}>
          <UCIcon />
        </Grid>
        <Grid item className={classes.title2}>
          Code Database
        </Grid>
        <Grid item>
          <Grid container className={classes.menu}>
            <Grid item>
              <Link component={RouterLink} to="/">
                Browse
              </Link>
            </Grid>
            <Grid item>
              <Link component={RouterLink} to="/login">
                Admin
              </Link>
            </Grid>
          </Grid>
        </Grid>
        <Grid item justify="flex-end">
          AVATAR
        </Grid>
      </Grid>
    </AppBar>
  );
};

export const Header = withStyles(getStyles)(_Header);
