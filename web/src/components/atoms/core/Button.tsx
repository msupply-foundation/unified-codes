import * as React from 'react';
import { Button as MButton, ButtonProps as MButtonProps } from '@material-ui/core';

export interface ButtonProps extends MButtonProps {};

export type Button = React.FunctionComponent<ButtonProps>;

export const Button = (props: ButtonProps) => <MButton {...props}/>;