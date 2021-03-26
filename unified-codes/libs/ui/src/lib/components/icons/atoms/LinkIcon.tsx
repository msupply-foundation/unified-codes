import React from 'react';

import { Link as MLink } from '@material-ui/icons';
import { SvgIconProps as MLinkProps } from '@material-ui/core';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export type LinkIconProps = MLinkProps;

export type LinkIcon = React.FunctionComponent<LinkIconProps>;

export const LinkIcon: LinkIcon = (props) => <MLink {...props}></MLink>;

export default LinkIcon;
