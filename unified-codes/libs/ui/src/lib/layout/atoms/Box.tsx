import * as React from "react";

import { Box as MBox, BoxProps as MBoxProps } from "@material-ui/core";

export type BoxProps = MBoxProps;

export type Box = React.FunctionComponent<BoxProps>;

export const Box: Box = props => <MBox {...props}></MBox>;

export default Box;