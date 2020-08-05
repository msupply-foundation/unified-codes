import * as React from "react";
import MAlert, {
  AlertProps as MAlertProps,
  Color,
} from "@material-ui/lab/Alert";

export interface AlertProps extends MAlertProps {}
export type Alert = React.FunctionComponent<AlertProps>;

export const Alert = (props: AlertProps) => <MAlert {...props} />;
export type Severity = Color;
