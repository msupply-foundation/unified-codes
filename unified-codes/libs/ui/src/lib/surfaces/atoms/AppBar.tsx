import * as React from "react";

import { AppBar as MAppBar, AppBarProps as MAppBarProps } from "@material-ui/core";

export type AppBarProps = MAppBarProps;

export type AppBar = React.FunctionComponent<AppBarProps>;

export const AppBar: AppBar = props => <MAppBar {...props}></MAppBar>;

export default AppBar;
