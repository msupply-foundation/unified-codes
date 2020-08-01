import * as React from "react";

import { Grid, TextField } from "../atoms";

export const Login = () => (
    <Grid container justify="center">
        <Grid container item xs={3} direction="column">
            <Grid item>
                <TextField fullWidth label="Username"/>
            </Grid>
            <Grid item>
                <TextField fullWidth label="Password" type="password"/>
            </Grid>
        </Grid>
    </Grid>
);

export default Login;
