import React from 'react';

import { FileCopy as MFileCopy } from '@material-ui/icons';

export interface FileCopyIconProps {}

export type FileCopyIcon = React.FunctionComponent<FileCopyIconProps>;

export const FileCopyIcon: FileCopyIcon = (props) => <MFileCopy {...props}></MFileCopy>;

export default FileCopyIcon;
