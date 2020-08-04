import * as React from "react";
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

export const App = () => {
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
              <Toolbar>
                <MenuBar open={isOpen} onClick={onClick} onClose={onClose}>
                  <MenuItem onClick={onClose}><Link to="/explorer" >Browse</Link></MenuItem>
                  <MenuItem onClick={onClose}><Link to="/login">Admin</Link></MenuItem>
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

export default App;
