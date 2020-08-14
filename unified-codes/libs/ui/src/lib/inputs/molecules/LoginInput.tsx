import * as React from 'react';

import Grid from '../../layout/atoms/Grid';
import PasswordInput from './PasswordInput';
import UsernameInput from './UsernameInput';

export interface LoginInputProps {
  username?: string;
  password?: string;
  onChange?: ({ username, password }: { username?: string; password?: string }) => void;
}

export type LoginInput = React.FunctionComponent<LoginInputProps>;

export const LoginInput: LoginInput = ({ username = '', password = '', onChange = () => null }) => (
  <Grid container direction="column">
    <UsernameInput input={username} onChange={(value) => onChange({ username: value, password })} />
    <PasswordInput input={password} onChange={(value) => onChange({ username, password: value })} />
  </Grid>
);

export default LoginInput;
