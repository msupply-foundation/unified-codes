import * as React from 'react';
import { connect } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
import Link from '@material-ui/core/Link';

import { AppBar, Avatar, Grid, UCIcon } from '@unified-codes/ui/components';
import { withStyles, FlexDirection } from '@unified-codes/ui/styles';

import AlertBar from '../alert/AlertBar';

import { ITheme } from '../../../styles';
import { IAlert } from '../../../types';
import { AlertActions, IAlertAction } from '../../../actions';

export interface HeaderProps {
  classes?: {
    root?: string;
    title1?: string;
    title2?: string;
    menu?: string;
  };
  alert: IAlert;
  resetAlert: () => void;
}

const styles = (theme: ITheme) => ({
  root: {
    alignItems: 'center',
    backgroundColor: theme.palette.background.footer,
    flexDirection: 'row' as FlexDirection,
    padding: '12px 24px 12px 24px',
    ' & div': {
      flex: '0 1 0%',
    },
    boxShadow: 'none',
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
    paddingRight: '5px!important',
    ...theme.typography.subtitle1,
  },
  title2: {
    paddingLeft: '5px!important',
    ...theme.typography.subtitle2,
  },
});

export type Header = React.FunctionComponent<HeaderProps>;

const Header: Header = ({ classes, alert, resetAlert }) => {
  return (
    <Grid container spacing={3} direction="column" justify="space-between" alignItems="stretch">
      <AppBar position="fixed" className={classes?.root}>
        <Grid item className={classes?.title1}>
          Universal&nbsp;Drug
        </Grid>
        <Grid item style={{ paddingLeft: 0, paddingRight: 0 }}>
          <UCIcon />
        </Grid>
        <Grid item className={classes?.title2}>
          Code&nbsp;Database
        </Grid>
        <Grid item style={{ flex: 1 }}>
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
          </Grid>
        </Grid>
        <Grid item>
          <Avatar />
        </Grid>
      </AppBar>
      <AlertBar
        isVisible={alert.isVisible}
        text={alert.text}
        severity={alert.severity}
        onClose={resetAlert}
      />
    </Grid>
  );
};

const mapDispatchToProps = (dispatch: React.Dispatch<IAlertAction>) => {
  const resetAlert = () => dispatch(AlertActions.resetAlert());
  return { resetAlert };
};

const mapStateToProps = (state: any) => {
  const { alert } = state;
  return { alert };
};

export const AppHeader = connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Header));

export default AppHeader;
