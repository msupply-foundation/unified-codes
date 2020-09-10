import React from 'react';

import { KeyboardArrowUp as MArrowUp } from '@material-ui/icons';

export interface ArrowUpIconProps {
  style: React.CSSProperties;
}

export type ArrowUpIcon = React.FunctionComponent<ArrowUpIconProps>;

export const ArrowUpIcon: ArrowUpIcon = (props) => <MArrowUp {...props}></MArrowUp>;

export default ArrowUpIcon;
