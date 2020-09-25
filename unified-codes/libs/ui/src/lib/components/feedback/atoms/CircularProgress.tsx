import React from 'react';

import { CircularProgress as MCircularProgress, CircularProgressProps as MCircularProgressProps } from '@material-ui/core';

export type CircularProgressProps = MCircularProgressProps;

export type CircularProgress = React.FunctionComponent<CircularProgressProps>;

export const CircularProgress: CircularProgress = (props) => <MCircularProgress {...props}></MCircularProgress>;

export default CircularProgress;
