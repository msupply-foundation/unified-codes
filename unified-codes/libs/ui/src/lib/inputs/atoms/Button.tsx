import * as React from "react";

import { Button as MButton, ButtonProps as MButtonProps } from "@material-ui/core";

export type ButtonProps = MButtonProps;

export type Button = React.FunctionComponent<ButtonProps>;

export const Button: Button = props => <MButton {...props}></MButton>;

export default Button;