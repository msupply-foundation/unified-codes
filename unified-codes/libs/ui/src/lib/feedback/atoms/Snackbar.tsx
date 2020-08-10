import React from 'react';

import { Snackbar as MSnackbar, SnackbarProps as MSnackbarProps } from "@material-ui/core";

export type SnackbarProps = MSnackbarProps;

export type Snackbar = React.FunctionComponent<SnackbarProps>;

export const Snackbar: Snackbar = props => <MSnackbar {...props}></MSnackbar>;

export default Snackbar;
