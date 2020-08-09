import * as React from "react";

import { Container as MContainer, ContainerProps as MContainerProps } from "@material-ui/core";

export type ContainerProps = MContainerProps;

export type Container = React.FunctionComponent<ContainerProps>;

export const Container: Container = props => <MContainer {...props}></MContainer>;

export default Container;