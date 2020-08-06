import * as React from "react";
import { connect } from "react-redux";
import { State, IUser } from "./types";
import PropTypes from "prop-types";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch,
  Redirect,
} from "react-router-dom";
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client";
import {
  AppBar,
  Container,
  Explorer,
  Grid,
  Login,
  MenuBar,
  MenuItem,
  Toolbar,
} from "./components";

interface AppProps {
  user?: IUser;
}
type App = React.FunctionComponent<AppProps>;

const _App: App = ({ user }) => {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const onClick = React.useCallback(() => setIsOpen(true), [setIsOpen]);
  const onClose = React.useCallback(() => setIsOpen(false), [setIsOpen]);

  const client = new ApolloClient({
    uri: "http://localhost:4000/graphql",
    cache: new InMemoryCache(),
  });

  return (
    <Router>
      <Container>
        <Grid
          container
          spacing={3}
          direction="column"
          justify="space-between"
          alignItems="stretch"
        >
          <Grid item>
            <AppBar position="static">
              {user && user.isValid && `Welcome ${user.name}`}
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
                <ApolloProvider client={client}>
                  <Explorer />
                </ApolloProvider>
              </Route>
              <Route exact path="/login">
                <ApolloProvider client={client}>
                  <Login />
                </ApolloProvider>
              </Route>
              <Route>
                <Redirect to="/explorer" />
              </Route>
            </Switch>
          </Grid>
        </Grid>
      </Container>
    </Router>
  );
};

const mapStateToProps = (state: State) => {
  const { user } = state;

  return {
    user,
  };
};
export const App = connect(mapStateToProps)(_App);
