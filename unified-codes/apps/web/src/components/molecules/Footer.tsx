import * as React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Link from '@material-ui/core/Link';
import { Theme, withStyles } from '@material-ui/core/styles';
import { ClassNameMap } from '@material-ui/core/styles/withStyles';

import { Drawer, Grid, TMFLogo } from '@unified-codes/ui';

export interface FooterProps {
  classes: ClassNameMap<any>;
}

type flexDirection = 'column' | 'row';

const getStyles = (theme: Theme) => ({
  root: {},
  logo: {
    marginBottom: 15,
  },
  menu: {
    marginBottom: 17,
    marginTop: 32,
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
    backgroundColor: theme.palette.divider,
    display: 'flex',
    flexDirection: 'column' as flexDirection,
    fontFamily: 'roboto',
    ' & div': {
      flex: '0 1 0%',
    },
  },
});

export type Footer = React.FunctionComponent<FooterProps>;

const StyledDrawer = withStyles(getStyles)(Drawer);
const _Footer: Footer = ({ classes }) => {
  return (
    <StyledDrawer anchor="bottom" variant="permanent">
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
    </StyledDrawer>
  );
};

export const Footer = withStyles(getStyles)(_Footer);
