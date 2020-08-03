import * as React from "react";
import { Grid } from "../../atoms"
import { LoginButtons, LoginInput } from "../../molecules";

export const LoginForm = () => {
    return (
        <Grid container direction="column" spacing={2} alignItems="center">
            <Grid item><LoginInput/></Grid>
            <Grid item><LoginButtons/></Grid>
        </Grid>
    )
};

export default LoginForm;
