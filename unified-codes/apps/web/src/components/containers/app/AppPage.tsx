import * as React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import { Box } from '@unified-codes/ui/components';
import { makeStyles, createStyles } from '@unified-codes/ui/styles';

import { ITheme } from '../../../styles';

import DetailPage from '../detail/DetailPage';
import ErrorPage from '../error/ErrorPage';
import ExplorerPage from '../explorer/ExplorerPage';
import Login from '../login/Login';

const useStyles = makeStyles((theme: ITheme) => createStyles({
    root: {
        backgroundColor: theme.palette.background.paper,
        marginTop: 96,
        height: 'calc(100vh - 90px)',
        paddingBottom: 10,
   },
}));

export const AppPage = () => {
    const classes = useStyles();

    return (
        <Box className={classes.root}>
            <Switch>
                <Route path="/detail/:code">
                    <DetailPage />
                </Route>
                <Route exact path="/">
                    <ExplorerPage />
                </Route>
                <Route exact path="/explorer">
                    <ExplorerPage />
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
        </Box>
    );
};

export default AppPage;