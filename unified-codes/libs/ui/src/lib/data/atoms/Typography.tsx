import * as React from "react";

import { Typography as MTypography, TypographyProps as MTypographyProps } from "@material-ui/core";

export type TypographyProps = MTypographyProps;

export type Typography = React.FunctionComponent<TypographyProps>;

export const Typography: Typography = props => <MTypography {...props}></MTypography>;

export default Typography;