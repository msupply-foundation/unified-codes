import * as React from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';

import { Container, Grid, AlertBar } from '@unified-codes/ui';
import { IAlert } from '@unified-codes/data';

import ExplorerBrowser from '../explorer/ExplorerBrowser';
import DetailViewer from '../detail/DetailViewer';
import Login from '../login/Login';
import Footer from './Footer';
import Header from './Header';
import ErrorPage from '../pages/ErrorPage';

import { AlertActions } from '../../actions';
import { withStyles } from '../../styles';
import { ITheme } from '../../types';
import { ClassNameMap } from '../../types';

export interface AppProps {
  alert: IAlert;
  classes: ClassNameMap<any>;
  resetAlert: () => void;
}

const getStyles = (theme: ITheme) => ({
  container: {
    overflow: 'hidden',
    paddingLeft: 0,
    paddingRight: 0,
  },
  content: {
    backgroundColor: theme.palette.background.paper,
    marginTop: 96,
    height: 'calc(100vh - 90px)',
    paddingBottom: 10,
  },
});

export type App = React.FunctionComponent<AppProps>;

const _App: App = ({ alert, classes, resetAlert }) => {
  return (
    <BrowserRouter>
      <Container maxWidth={false} className={classes.container}>
        <Grid container spacing={3} direction="column" justify="space-between" alignItems="stretch">
          <Header />
          <AlertBar
            isVisible={alert.isVisible}
            text={alert.text}
            severity={alert.severity}
            onClose={resetAlert}
          />
        </Grid>
        <div className={classes.content}>
          <Switch>
            <Route path="/detail/:code">
              <DetailViewer />
            </Route>
            <Route exact path="/">
              <ExplorerBrowser />
            </Route>
            <Route exact path="/explorer">
              <ExplorerBrowser />
            </Route>
            <Route exact path="/login">
              <Login />
            </Route>
            <Route exact path="/404">
              <ErrorPage code="404" />
            </Route>
            <Route>
              <Redirect to="/404" />
            </Route>
          </Switch>
        </div>
      </Container>
      <Footer />
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

export const AppComponent = withStyles(getStyles)(_App);
export const App = connect(mapStateToProps, mapDispatchToProps)(AppComponent);

export default App;
