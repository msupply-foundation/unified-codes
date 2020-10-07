import * as React from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';

import { Container, Grid, AlertBar } from '@unified-codes/ui';
import { IAlert } from '@unified-codes/data';

import ExplorerBrowser from '../explorer/ExplorerBrowser';
import DetailViewer from '../detail/DetailViewer'
import Login from '../login/Login';
import Footer from './Footer';
import Header from './Header';

import { AlertActions } from '../../actions';
import { withStyles } from '../../styles';
import { ClassNameMap, ITheme } from '../../types';


export interface AppProps {
  alert: IAlert;
  classes: ClassNameMap<any>;
  resetAlert: () => void;
}

const getStyles = (theme: ITheme) => ({
  body: theme.typography.body1,
  container: {
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
            <Route exact path="/explorer">
              <ExplorerBrowser />
            </Route>
            <Route exact path="/login">
              <Login />
            </Route>
            <Route exact path="/detail/:code">
              <DetailViewer/>
            </Route>
            <Route>
              <Redirect to="/explorer" />
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
