import React from 'react';

import { Visibility as MVisibility } from "@material-ui/icons";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface VisibilityIconProps {};

export type VisibilityIcon = React.FunctionComponent<VisibilityIconProps>;

export const VisibilityIcon: VisibilityIcon = props => <MVisibility {...props}></MVisibility>;

export default VisibilityIcon;
