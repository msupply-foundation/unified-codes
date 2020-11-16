import * as React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Link from '@material-ui/core/Link';

import { Grid, Box, TMFLogo } from '@unified-codes/ui/components';
import { withStyles, FlexDirection, Position } from '@unified-codes/ui/styles';

import { ITheme } from '../../../styles';

export interface FooterProps {
  classes?: {
    root: string;
    logo: string;
    menu: string;
  };
}

const getStyles = (theme: ITheme) => ({
  root: {
    height: 120,
    position: 'fixed' as Position,
    width: '100%',
    bottom: 0,
    alignItems: 'center',
    backgroundColor: theme.palette.background.footer,
    display: 'flex',
    flexDirection: 'column' as FlexDirection,
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
});

export type Footer = React.FunctionComponent<FooterProps>;

const Footer: Footer = ({ classes }) => {
  return (
    <Box className={classes?.root}>
      <Grid item>
        <Grid container className={classes?.menu}>
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
          <Grid item>
            <Link href="https://github.com/openmsupply/unified-codes/wiki">API</Link>
          </Grid>
        </Grid>
      </Grid>
      <Grid item className={classes?.logo}>
        <a href="https://msupply.foundation" title="mSupply Foundation website">
          <TMFLogo />
        </a>
      </Grid>
    </Box>
  );
};

export const AppFooter = withStyles(getStyles)(Footer);

export default AppFooter;
