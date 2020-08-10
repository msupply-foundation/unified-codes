import * as React from "react";

import { 
  TextField as MTextField, 
  TextFieldProps as MTextFieldProps, 
  StandardTextFieldProps as MStandardTextFieldProps, 
  FilledTextFieldProps as MFilledTextFieldProps, 
  OutlinedTextFieldProps as MOutlinedTextFieldProps 
} from "@material-ui/core";

export type TextFieldProps = MTextFieldProps;
export type StandardTextFieldProps = MStandardTextFieldProps;
export type FilledTextFieldProps = MFilledTextFieldProps;
export type OutlinedTextFieldProps = MOutlinedTextFieldProps;

export type TextField = React.FunctionComponent<TextFieldProps>;

export const TextField: TextField = props => <MTextField {...props}></MTextField>;

export default TextField;