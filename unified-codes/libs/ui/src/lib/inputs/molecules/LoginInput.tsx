import * as React from "react";

<<<<<<< HEAD:unified-codes/libs/ui/src/lib/inputs/molecules/LoginInput.tsx
import Grid from "../../layout/atoms/Grid";
import PasswordInput from "./PasswordInput";
import UsernameInput from "./UsernameInput";
=======
import { Grid } from "../../atoms";
import { UsernameInput } from "./UsernameInput";
import { PasswordInput } from "./PasswordInput";
>>>>>>> master:nx-workspace/apps/web/src/components/molecules/core/LoginInput.tsx

export interface LoginInputProps {
  username?: string;
  password?: string;
  onChange?: ({
    username,
    password,
  }: {
    username?: string;
    password?: string;
  }) => void;
}

export type LoginInput = React.FunctionComponent<LoginInputProps>;

export const LoginInput: LoginInput = ({
  username = "",
  password = "",
  onChange = () => null,
}) => (
  <Grid container direction="column">
    <UsernameInput
      input={username}
      onChange={(value) => onChange({ username: value, password })}
    />
    <PasswordInput
      input={password}
      onChange={(value) => onChange({ username, password: value })}
    />
  </Grid>
);

export default LoginInput;
