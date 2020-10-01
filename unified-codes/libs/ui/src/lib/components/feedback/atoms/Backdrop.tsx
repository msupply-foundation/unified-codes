import React from 'react';

import { Backdrop as MBackdrop, BackdropProps as MBackdropProps } from '@material-ui/core';

export type BackdropProps = MBackdropProps;

export type Backdrop = React.FunctionComponent<BackdropProps>;

export const Backdrop: Backdrop = (props) => <MBackdrop {...props}></MBackdrop>;

export default Backdrop;
