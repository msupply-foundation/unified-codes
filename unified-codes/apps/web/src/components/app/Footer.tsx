import * as React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Link from '@material-ui/core/Link';
import { withStyles } from '@material-ui/core/styles';
import { ClassNameMap } from '@material-ui/core/styles/withStyles';

import { Grid, Paper, TMFLogo } from '@unified-codes/ui';

import { flexDirection, ITheme, position } from '../../types';

export interface FooterProps {
  classes: ClassNameMap<any>;
}

const getStyles = (theme: ITheme) => ({
  root: {
    height: 120,
    position: 'fixed' as position,
    width: '100%',
    bottom: 0,
    alignItems: 'center',
    backgroundColor: theme.palette.background.footer,
    display: 'flex',
    flexDirection: 'column' as flexDirection,
    fontFamily: 'roboto',
    ' & div': {
      flex: '0 1 0%',
    },
  },
  logo: {
    marginBottom: 15,
  },
  menu: {
    marginBottom: 15,
    marginTop: 15,
    '& div ': {
      paddingRight: 15,
    },
    '& a': {
      color: theme.typography.subtitle2.color,
      fontSize: 14,
      textTransform: 'uppercase',
    },
  },
  paper: {
    alignItems: 'center',
    backgroundColor: theme.palette.background.footer,
    display: 'flex',
    flexDirection: 'column' as flexDirection,
    fontFamily: 'roboto',
    ' & div': {
      flex: '0 1 0%',
    },
  },
});

export type Footer = React.FunctionComponent<FooterProps>;

const _Footer: Footer = ({ classes }) => {
  return (
    <Paper className={classes.root} square elevation={0}>
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
      <Grid item className={classes.logo}>
        <a href="https://msupply.foundation" title="mSupply Foundation website">
          <TMFLogo />
        </a>
      </Grid>
    </Paper>
  );
};

export const Footer = withStyles(getStyles)(_Footer);

export default Footer;