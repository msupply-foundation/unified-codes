import React from 'react';

import { SvgIcon as MSvgIcon, SvgIconProps as MSvgIconProps } from "@material-ui/core";

export type SvgIconProps = MSvgIconProps;

export type SvgIcon = React.FunctionComponent<SvgIconProps>;

export const SvgIcon: SvgIcon = props => <MSvgIcon {...props}></MSvgIcon>;

export default SvgIcon;
