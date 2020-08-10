// Note: this component causes errors if wrapped like the other material-ui components.
// See https://github.com/mui-org/material-ui/issues/21127.

import { MenuItem as MMenuItem, MenuItemProps as MMenuItemProps } from "@material-ui/core";

export type MenuItemProps = MMenuItemProps;

export const MenuItem = MMenuItem;

export default MenuItem;