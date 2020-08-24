import * as React from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { BrowserRouter, Route, Link, Switch, Redirect } from 'react-router-dom';

import { AppBar, Container, Grid, MenuBar, MenuItem, Toolbar, AlertBar } from '@unified-codes/ui';
import { IAlert } from '@unified-codes/data';

import { AlertActions } from './actions';
import { Explorer, Login } from './components';

export interface AppProps {
  alert: IAlert;
  resetAlert: () => void;
}

export type App = React.FunctionComponent<AppProps>;

export const AppComponent: App = ({ alert, resetAlert }) => {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const onClick = React.useCallback(() => setIsOpen(true), [setIsOpen]);
  const onClose = React.useCallback(() => setIsOpen(false), [setIsOpen]);

  return (
    <BrowserRouter>
      <Container>
        <Grid container spacing={3} direction="column" justify="space-between" alignItems="stretch">
          <Grid item>
            <AppBar position="static">
              <Toolbar>
                <MenuBar open={isOpen} onClick={onClick} onClose={onClose}>
                  <MenuItem onClick={onClose}>
                    <Link to="/explorer">Browse</Link>
                  </MenuItem>
                  <MenuItem onClick={onClose}>
                    <Link to="/login">Admin</Link>
                  </MenuItem>
                </MenuBar>
              </Toolbar>
            </AppBar>
          </Grid>
          <Grid container item>
            <Switch>
              <Route exact path="/explorer">
                <Explorer />
              </Route>
              <Route exact path="/login">
                <Login />
              </Route>
              <Route>
                <Redirect to="/explorer" />
              </Route>
            </Switch>
          </Grid>
          <AlertBar
            isVisible={alert.isVisible}
            text={alert.text}
            severity={alert.severity}
            onClose={resetAlert}
          />
        </Grid>
      </Container>
    </BrowserRouter>
  );
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  const resetAlert = () => dispatch(AlertActions.resetAlert());
  return { resetAlert };
};

const mapStateToProps = (state: any) => {
  const { alert, entities } = state;
  return { alert, entities };
};

export const App = connect(mapStateToProps, mapDispatchToProps)(AppComponent);

export default App;
