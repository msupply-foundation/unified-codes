import * as React from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import { Theme, withStyles } from '@material-ui/core/styles';
import { ClassNameMap } from '@material-ui/core/styles/withStyles';

import { Container, Grid, AlertBar } from '@unified-codes/ui';
import { IAlert } from '@unified-codes/data';

import { AlertActions } from './actions';
import { Explorer, Header, Login } from './components';

export interface AppProps {
  alert: IAlert;
  classes: ClassNameMap<any>;
  hideAlert: () => void;
}

const getStyles = (theme: Theme) => ({
  body: theme.typography.body1,
});

export type App = React.FunctionComponent<AppProps>;

const _App: App = ({ alert, classes, hideAlert }) => {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const onClick = React.useCallback(() => setIsOpen(true), [setIsOpen]);
  const onClose = React.useCallback(() => setIsOpen(false), [setIsOpen]);

  return (
    <BrowserRouter>
      <Container>
        <Grid container spacing={3} direction="column" justify="space-between" alignItems="stretch">
          <Header />
          <AlertBar
            isVisible={alert.isVisible}
            text={alert.text}
            severity={alert.severity}
            onClose={hideAlert}
          />
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
      </Container>
    </BrowserRouter>
  );
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  const hideAlert = () => dispatch(AlertActions.hideAlert());
  return { hideAlert };
};

const mapStateToProps = (state: any) => {
  const { alert, entities } = state;
  return { alert, entities };
};

export const AppComponent = withStyles(getStyles)(_App);
export const App = connect(mapStateToProps, mapDispatchToProps)(AppComponent);

export default App;
