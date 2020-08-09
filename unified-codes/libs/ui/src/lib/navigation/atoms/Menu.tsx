import * as React from "react";

import { Menu as MMenu, MenuProps as MMenuProps } from "@material-ui/core";

export type MenuProps = MMenuProps;

export type Menu = React.FunctionComponent<MenuProps>;

export const Menu: Menu = props => <MMenu {...props}></MMenu>;

export default Menu;