import * as React from "react";

import { Icon, Grid, TextField, StandardTextFieldProps, FilledTextFieldProps, OutlinedTextFieldProps } from "../../atoms";

export interface StandardIconInputProps extends StandardTextFieldProps { icon: typeof Icon };
export interface FilledIconInputProps extends FilledTextFieldProps { icon: typeof Icon };
export interface OutlinedIconInputProps extends OutlinedTextFieldProps { icon: typeof Icon };

export type IconInput = React.FunctionComponent<StandardIconInputProps | FilledIconInputProps | OutlinedIconInputProps>;

export const IconInput: IconInput = ({ icon: Icon, ...other }) => (
        <Grid container spacing={1} justify="center" alignItems="flex-end">
            <Grid item><Icon/></Grid> 
            <Grid item><TextField {...other} /></Grid> 
        </Grid>
    );
