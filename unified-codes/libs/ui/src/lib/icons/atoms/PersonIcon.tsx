import React from 'react';

import { Person as MPerson } from '@material-ui/icons';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface PersonIconProps {}

export type PersonIcon = React.FunctionComponent<PersonIconProps>;

export const PersonIcon: PersonIcon = (props) => <MPerson {...props}></MPerson>;

export default PersonIcon;
