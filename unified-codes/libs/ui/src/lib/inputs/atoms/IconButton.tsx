import * as React from "react";

import { IconButton as MIconButton, IconButtonProps as MIconButtonProps } from "@material-ui/core";

export type IconButtonProps = MIconButtonProps;

export type IconButton = React.FunctionComponent<IconButtonProps>;

export const IconButton: IconButton = props => <MIconButton {...props}></MIconButton>;

export default IconButton;