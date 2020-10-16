import React from 'react';

import { CheckCircle as MCheckCircle } from '@material-ui/icons';

export interface CheckCircleIconProps {}

export type CheckCircleIcon = React.FunctionComponent<CheckCircleIconProps>;

export const CheckCircleIcon: CheckCircleIcon = (props) => <MCheckCircle {...props}></MCheckCircle>;

export default CheckCircleIcon;
