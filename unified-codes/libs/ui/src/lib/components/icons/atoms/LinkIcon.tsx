import React from 'react';

import { Link as MLink } from '@material-ui/icons';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface LinkIconProps {}

export type LinkIcon = React.FunctionComponent<LinkIconProps>;

export const LinkIcon: LinkIcon = (props) => <MLink {...props}></MLink>;

export default LinkIcon;
