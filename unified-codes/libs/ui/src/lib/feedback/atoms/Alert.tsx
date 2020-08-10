import React from 'react';

import {
  Alert as MAlert,
  AlertProps as MAlertProps,
  Color as MColor,
} from "@material-ui/lab";

export type Severity = MColor;

export type AlertProps = MAlertProps;

export type Alert = React.FunctionComponent<AlertProps>;

export const Alert: Alert = props => <MAlert {...props}></MAlert>;

export default Alert;
