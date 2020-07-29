import * as React from "react";
import {
  Container as MContainer,
  ContainerProps as MContainerProps,
} from "@material-ui/core";

export interface ContainerProps extends MContainerProps {}

export type Container = React.FunctionComponent<ContainerProps>;

export const Container: Container = ({ children, ...props }) => (
  <MContainer {...props}>{children}</MContainer>
);
