import * as React from "react";

import { Grid, KeyIcon, PersonIcon, TextField } from "../../atoms";

export const LoginInput = () => (
    <Grid container direction="column">
        <Grid container spacing={1} alignItems="flex-end">
            <Grid item>
                <PersonIcon/>
            </Grid> 
            <Grid item>
                <TextField label="Username" />
            </Grid> 
        </Grid>
        <Grid container spacing={1} alignItems="flex-end">
            <Grid item>
                <KeyIcon/>
            </Grid> 
            <Grid item>
                <TextField label="Password" type="password"/>
            </Grid> 
        </Grid>
    </Grid>
);

export default LoginInput;
