import * as React from "react";
import MAlert, {
  AlertProps as MAlertProps,
  Color,
} from "@material-ui/lab/Alert";

export interface AlertProps extends MAlertProps {
  Color?: Color;
}

export type Alert = React.FunctionComponent<AlertProps>;

export const Alert = (props: AlertProps) => <MAlert {...props} />;
