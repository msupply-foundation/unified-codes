import * as React from 'react';

import ClearButton from './ClearButton';
import InputAdornment from '../atoms/InputAdornment';
import TextField, {
  StandardTextFieldProps,
  FilledTextFieldProps,
  OutlinedTextFieldProps,
} from '../atoms/TextField';

export interface StandardClearInputProps extends StandardTextFieldProps {
  classes?: {
    root?: string 
  };
  onClear?: () => void;
}
export interface FilledClearInputProps extends FilledTextFieldProps {
  classes?: {
    root?: string 
  };
  onClear?: () => void;
}
export interface OutlinedClearInputProps extends OutlinedTextFieldProps {
  classes?: {
    root?: string 
  };
  onClear?: () => void;
}

export type ClearInputProps =
  | StandardClearInputProps
  | FilledClearInputProps
  | OutlinedClearInputProps;

export type ClearInput = React.FunctionComponent<ClearInputProps>;

export const ClearInput: ClearInput = ({ classes, onClear, ...other }) => {
  const onClick = React.useMemo(() => onClear ?? undefined, [onClear]);
  return (
    <TextField
      classes={{ root: classes?.root }}
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
