import * as React from "react";
import { Grid, Button } from "../../atoms";

export const LoginButtons = () => (
    <Grid container>
        <Grid item>
            <Button>Login</Button>
        </Grid>
        <Grid item>
            <Button>Sign up</Button>
        </Grid>
    </Grid>
);

export default LoginButtons;
