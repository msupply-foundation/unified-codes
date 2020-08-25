import * as React from 'react';

import { Avatar as MAvatar, AvatarProps as MAvatarProps } from '@material-ui/core';

export type AvatarProps = MAvatarProps;

export type Avatar = React.FunctionComponent<AvatarProps>;

export const Avatar: Avatar = (props) => <MAvatar {...props}></MAvatar>;

export default Avatar;
