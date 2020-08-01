import * as React from "react";
import {
  BrowserRouter as Router,
  Link,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client";
import { AppBar, Button, Grid, Container, IconButton, Toolbar, Typography, VisibilityIcon } from "./components/atoms";
import { Explorer, Login } from "./components/templates";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    link: { color: "white" },
  })
);

export const App = () => {
  const classes = useStyles();

  const client = new ApolloClient({
    uri: "http://localhost:4000/graphql",
    cache: new InMemoryCache(),
  });

  return (
    <Router>
      <Container>
        <Grid container spacing={3} direction="column" justify="space-between" alignItems="stretch">
          <Grid container item>
            <AppBar position="static">
              <Toolbar>
                <Grid container alignItems="center">
                    <Grid container item xs={11} alignItems="center">
                      <Grid item>
                        <Link to="/explorer" className={classes.link}>
                          <IconButton edge="start" color="inherit" aria-label="menu">
                            <VisibilityIcon/>
                          </IconButton>
                        </Link>
                      </Grid>
                      <Grid item>
                        <Typography variant="h6">
                          Explorer
                        </Typography>
                      </Grid>
                    </Grid>
                    <Grid container item xs={1} alignItems="center">
                      <Button color="inherit" aria-label="login"><Link to="/login" className={classes.link}>Login</Link></Button>
                    </Grid>
                  </Grid>
              </Toolbar>
            </AppBar>
          </Grid>
          <Grid container item>
            <Switch>
              <Route exact path="/explorer">
                <ApolloProvider client={client}>
                    <Explorer/>
                </ApolloProvider>
              </Route>
              <Route exact path="/login">
                <ApolloProvider client={client}>
                    <Login/>
                </ApolloProvider>
              </Route>
              <Route>
                <Redirect to="/explorer"/>
              </Route>
            </Switch>
          </Grid>
        </Grid>
      </Container>
    </Router>
  );
};

export default App;