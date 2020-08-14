import * as React from 'react';

import {
  InputAdornment as MInputAdornment,
  InputAdornmentProps as MInputAdornmentProps,
} from '@material-ui/core';

export type InputAdornmentProps = MInputAdornmentProps;

export type InputAdornment = React.FunctionComponent<InputAdornmentProps>;

export const InputAdornment: InputAdornment = (props) => (
  <MInputAdornment {...props}></MInputAdornment>
);

export default InputAdornment;
