import React from 'react';

import {
  DialogContent as MDialogContent,
  DialogContentProps as MDialogContentProps,
} from '@material-ui/core';

export type DialogContentProps = MDialogContentProps;

export type DialogContent = React.FunctionComponent<DialogContentProps>;

export const DialogContent: DialogContent = (props) => <MDialogContent {...props}></MDialogContent>;

export default DialogContent;
