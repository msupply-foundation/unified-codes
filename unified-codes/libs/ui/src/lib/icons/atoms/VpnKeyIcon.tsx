import React from 'react';

import { VpnKey as MVpnKey } from '@material-ui/icons';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface VpnKeyIconProps {}

export type VpnKeyIcon = React.FunctionComponent<VpnKeyIconProps>;

export const VpnKeyIcon: VpnKeyIcon = (props) => <MVpnKey {...props}></MVpnKey>;

export default VpnKeyIcon;
