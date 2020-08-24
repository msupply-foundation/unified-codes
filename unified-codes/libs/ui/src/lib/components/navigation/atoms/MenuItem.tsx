import * as React from 'react';

import { MenuItem as MMenuItem, MenuItemProps as MMenuItemProps } from '@material-ui/core';

// Note: this component causes errors if wrapped like the other material-ui components.
// See https://github.com/mui-org/material-ui/issues/21127.

export type MenuItemProps = MMenuItemProps;

export type MenuItem = React.FunctionComponent<MenuItemProps>;

export const MenuItem = MMenuItem;

export default MenuItem;
