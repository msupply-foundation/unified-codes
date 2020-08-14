import * as React from 'react';

import ClearButton from './ClearButton';
import InputAdornment from '../atoms/InputAdornment';
import TextField, {
  StandardTextFieldProps,
  FilledTextFieldProps,
  OutlinedTextFieldProps,
} from '../atoms/TextField';

export interface StandardClearInputProps extends StandardTextFieldProps {
  onClear?: () => void;
}
export interface FilledClearInputProps extends FilledTextFieldProps {
  onClear?: () => void;
}
export interface OutlinedClearInputProps extends OutlinedTextFieldProps {
  onClear?: () => void;
}

export type ClearInput = React.FunctionComponent<
  StandardClearInputProps | FilledClearInputProps | OutlinedClearInputProps
>;

export const ClearInput: ClearInput = ({ onClear, ...other }) => {
  const onClick = React.useMemo(() => onClear ?? null, [onClear]);
  return (
    <TextField
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <ClearButton onClick={onClick} />
          </InputAdornment>
        ),
      }}
      {...other}
    />
  );
};

export default ClearInput;
