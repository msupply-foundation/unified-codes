import * as React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Link from '@material-ui/core/Link';
import { Theme, withStyles } from '@material-ui/core/styles';
import { ClassNameMap } from '@material-ui/core/styles/withStyles';

import { AppBar, Grid, UCIcon, Typography } from '@unified-codes/ui';

export interface HeaderProps {
  classes: ClassNameMap<any>;
}

type flexDirection = 'column' | 'row';
const getStyles = (theme: Theme) => ({
  root: {
    alignItems: 'center',
    backgroundColor: theme.palette.divider,
    flexDirection: 'row' as flexDirection,
    padding: 12,
    paddingTop: 29,
    ' & div': {
      flex: '0 1 0%',
    },
  },
  body: theme.typography.body1,
  logo: {
    fontWeight: 700,
  },
  menu: {
    marginLeft: 150,
    '& div ': {
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
});

export type Header = React.FunctionComponent<HeaderProps>;

const _Header: Header = ({ classes }) => {
  return (
    <AppBar position="static" className={classes.root}>
      <Grid item className={classes.title1}>
        Universal&nbsp;Drug
      </Grid>
      <Grid item style={{ paddingLeft: 0, paddingRight: 0 }}>
        <UCIcon />
      </Grid>
      <Grid item className={classes.title2}>
        Code&nbsp;Database
      </Grid>
      <Grid item style={{ flex: 1 }}>
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
    </AppBar>
  );
};

export const Header = withStyles(getStyles)(_Header);
