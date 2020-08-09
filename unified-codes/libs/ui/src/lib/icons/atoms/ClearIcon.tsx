import React from 'react';

import { Clear as MClear } from "@material-ui/icons";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ClearIconProps {};

export type ClearIcon = React.FunctionComponent<ClearIconProps>;

export const ClearIcon: ClearIcon = props => <MClear {...props}></MClear>;

export default ClearIcon;