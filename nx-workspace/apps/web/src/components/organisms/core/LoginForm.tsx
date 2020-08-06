import * as React from "react";

import { Button, Grid, Typography } from "../../atoms";
import { LoginInput } from "../../molecules";

export interface LoginFormProps {
  onSubmit?: (username: string, password: string) => void;
}

export type LoginForm = React.FunctionComponent<LoginFormProps>;

export const LoginForm: LoginForm = ({ onSubmit }) => {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");

  const onChange = React.useCallback(({ username, password }) => {
    setUsername(username);
    setPassword(password);
  }, []);

  const onClick = React.useCallback(
    () => (onSubmit ? onSubmit(username, password) : null),
    [username, password, onSubmit]
  );

  return (
    <Grid>
      <Grid item>
        <Typography align="center" display="block" variant="button">
          Login
        </Typography>
      </Grid>
      <Grid container direction="column" spacing={3} alignItems="stretch">
        <Grid item>
          <LoginInput
            username={username}
            password={password}
            onChange={onChange}
          />
        </Grid>
        <Grid item>
          <Button fullWidth onClick={onClick}>
            Submit
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default LoginForm;
