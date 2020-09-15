import * as React from 'react';

import { Paper as MPaper, PaperProps as MPaperProps } from '@material-ui/core';

export type PaperProps = MPaperProps;

export type Paper = React.FunctionComponent<PaperProps>;

export const Paper: Paper = (props) => <MPaper {...props}></MPaper>;

export default Paper;
