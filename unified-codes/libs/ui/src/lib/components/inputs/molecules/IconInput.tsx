import * as React from 'react';

import Grid from '../../layout/atoms/Grid';
import SvgIcon from '../../icons/atoms/SvgIcon';
import TextField, {
  StandardTextFieldProps,
  FilledTextFieldProps,
  OutlinedTextFieldProps,
} from '../atoms/TextField';

export interface StandardIconInputProps extends StandardTextFieldProps {
  icon: typeof SvgIcon;
}
export interface FilledIconInputProps extends FilledTextFieldProps {
  icon: typeof SvgIcon;
}
export interface OutlinedIconInputProps extends OutlinedTextFieldProps {
  icon: typeof SvgIcon;
}

export type IconInput = React.FunctionComponent<
  StandardIconInputProps | FilledIconInputProps | OutlinedIconInputProps
>;

export const IconInput: IconInput = ({ icon: Icon, ...other }) => (
  <Grid container spacing={1} justify="center" alignItems="flex-end">
    <Grid item>
      <Icon />
    </Grid>
    <Grid item>
      <TextField {...other} />
    </Grid>
  </Grid>
);

export default IconInput;
