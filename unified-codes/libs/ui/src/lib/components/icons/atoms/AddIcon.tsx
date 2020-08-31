import React from 'react';

import { Add as MAdd } from '@material-ui/icons';

export interface AddIconProps {}

export type AddIcon = React.FunctionComponent<AddIconProps>;

export const AddIcon: AddIcon = (props) => <MAdd {...props}></MAdd>;

export default AddIcon;
