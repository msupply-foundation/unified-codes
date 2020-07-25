import * as React from 'react';
import { Input as MInput, InputProps as MInputProps } from '@material-ui/core';

export interface InputProps extends MInputProps {};

export type Input = React.FunctionComponent<InputProps>;

export const Input = (props: InputProps) => <MInput {...props}/>;