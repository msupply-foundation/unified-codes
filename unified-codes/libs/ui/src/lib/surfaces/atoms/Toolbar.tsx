import * as React from "react";

import { Toolbar as MToolbar, ToolbarProps as MToolbarProps } from "@material-ui/core";

export type ToolbarProps = MToolbarProps;

export type Toolbar = React.FunctionComponent<ToolbarProps>;

export const Toolbar: Toolbar = props => <MToolbar {...props}></MToolbar>;

export default Toolbar;