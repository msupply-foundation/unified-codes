import * as React from 'react';

import { Drawer as MDrawer, DrawerProps as MDrawerProps } from '@material-ui/core';

export type DrawerProps = MDrawerProps;

export type Drawer = React.FunctionComponent<DrawerProps>;

export const Drawer: Drawer = (props) => <MDrawer {...props}></MDrawer>;

export default Drawer;
