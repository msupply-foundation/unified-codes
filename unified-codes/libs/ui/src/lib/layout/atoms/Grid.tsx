import * as React from 'react';

import { Grid as MGrid, GridProps as MGridProps } from '@material-ui/core';

export type GridProps = MGridProps;

export type Grid = React.FunctionComponent<GridProps>;

export const Grid: Grid = (props) => <MGrid {...props}></MGrid>;

export default Grid;
