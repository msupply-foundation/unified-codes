import React from 'react';

import { Menu as MMenu } from "@material-ui/icons";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface MenuIconProps {};

export type MenuIcon = React.FunctionComponent<MenuIconProps>;

export const MenuIcon: MenuIcon = props => <MMenu {...props}></MMenu>;

export default MenuIcon;