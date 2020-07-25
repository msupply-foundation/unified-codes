import * as React from 'react';
import { Clear } from '@material-ui/icons';

export interface ClearIconProps {};

export type ClearIcon = React.FunctionComponent<ClearIconProps>;

export const ClearIcon: ClearIcon = () => <Clear/>;