import * as React from "react";

import {
  TextField,
  StandardTextFieldProps,
  FilledTextFieldProps,
  OutlinedTextFieldProps,
  InputAdornment,
} from "../../atoms";
import { ClearButton } from "./ClearButton";

export interface StandardClearInputProps extends StandardTextFieldProps {
  onClear: () => void;
}
export interface FilledClearInputProps extends FilledTextFieldProps {
  onClear: () => void;
}
export interface OutlinedClearInputProps extends OutlinedTextFieldProps {
  onClear: () => void;
}

export type ClearInput = React.FunctionComponent<
  StandardClearInputProps | FilledClearInputProps | OutlinedClearInputProps
>;

export const ClearInput: ClearInput = ({ onClear, ...other }) => (
  <TextField
    InputProps={{
      endAdornment: (
        <InputAdornment position="end">
          <ClearButton onClick={onClear} />
        </InputAdornment>
      ),
    }}
    {...other}
  />
);
