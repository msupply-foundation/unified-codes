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
  },
  body: theme.typography.body1,
  logo: {
    fontWeight: 700,
  },
  menu: {
    display: 'inline-block',
    height: 60,
    marginLeft: 250,
    '& a': {
      height: 16,
      width: 55,
      color: 'rgba(255,255,255,0.83)',
      display: 'inline-block',
      fontSize: 14,
      fontWeight: 500,
      letterSpacing: 0.13,
      lineHeight: 16,
      textAlign: 'center' as textAlignment,
      textTransform: 'uppercase',
    },
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
        justify="space-between"
        alignItems="stretch"
        className={classes.menu}
      >
        <Grid item>
          <UCIcon />
        </Grid>
        <Typography className={classes.menu}>
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
        </Typography>
      </Grid>
    </AppBar>
  );
};

export const Header = withStyles(getStyles)(_Header);
