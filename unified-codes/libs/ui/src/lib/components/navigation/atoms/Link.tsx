import * as React from 'react';

import { Link as MLink, LinkProps as MLinkProps } from '@material-ui/core';

export type LinkProps = MLinkProps;

export type Link = React.FunctionComponent<LinkProps>;

export const Link: Link = (props) => <MLink {...props}></MLink>;

export default Link;
