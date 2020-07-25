import * as React from 'react';

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {};

export type Container = React.FunctionComponent<ContainerProps>;

export const Container: Container = ({ className, style, children }) => <div className={className} style={style}>{children}</div>;