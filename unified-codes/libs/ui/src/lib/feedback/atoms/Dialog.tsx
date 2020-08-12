import React from 'react';

import { Dialog as MDialog, DialogProps as MDialogProps } from '@material-ui/core';

export type DialogProps = MDialogProps;

export type Dialog = React.FunctionComponent<DialogProps>;

export const Dialog: Dialog = (props) => <MDialog {...props}></MDialog>;

export default Dialog;
