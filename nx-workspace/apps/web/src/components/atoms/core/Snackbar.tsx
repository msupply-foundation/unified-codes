import * as React from "react";
import {
  Snackbar as MSnackbar,
  SnackbarProps as MSnackbarProps,
} from "@material-ui/core";

export interface SnackbarProps extends MSnackbarProps {}

export type Snackbar = React.FunctionComponent<SnackbarProps>;

export const Snackbar = (props: SnackbarProps) => <MSnackbar {...props} />;
