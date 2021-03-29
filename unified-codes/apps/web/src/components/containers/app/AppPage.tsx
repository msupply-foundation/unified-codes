import * as React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import { Box } from '@unified-codes/ui/components';
import { makeStyles, createStyles } from '@unified-codes/ui/styles';

import { PATHS, ROUTES } from '../../../routes';
import { ITheme } from '../../../styles';

const useStyles = makeStyles((theme: ITheme) =>
  createStyles({
    root: {
      backgroundColor: theme.palette.background.paper,
      marginTop: 96,
      height: '100%',
      paddingBottom: 10,
    },
  })
);

export interface AppPageProps {
  onMount: () => void;
  onUnmount: () => void;
}

export type AppPage = React.FunctionComponent<AppPageProps>;

export const AppPage = ({ onMount = () => null, onUnmount = () => null }) => {
  const classes = useStyles();

  const {
    ABOUT: AboutRoute,
    DETAIL: DetailRoute,
    EXPLORER: ExplorerRoute,
    LOGIN: LoginRoute,
    ERROR: ErrorRoute,
  } = ROUTES;

  const {
    ABOUT: aboutPath,
    DEFAULT: defaultPath,
    DETAIL: detailPath,
    EXPLORER: explorerPath,
    LOGIN: loginPath,
    ERROR: errorPath,
    ERROR_NOT_FOUND: errorNotFoundPath,
  } = PATHS;

  return (
    <Box className={classes.root}>
      <Switch>
        <Route exact path={defaultPath}>
          <ExplorerRoute />
        </Route>
        <Route exact path={detailPath}>
          <DetailRoute />
        </Route>
        <Route exact path={explorerPath}>
          <ExplorerRoute />
        </Route>
        <Route exact path={errorPath}>
          <ErrorRoute />
        </Route>
        <Route exact path={loginPath}>
          <LoginRoute />
        </Route>
        <Route exact path={aboutPath}>
          <AboutRoute />
        </Route>
        <Route>
          <Redirect to={errorNotFoundPath} />
        </Route>
      </Switch>
    </Box>
  );
};

export default AppPage;
