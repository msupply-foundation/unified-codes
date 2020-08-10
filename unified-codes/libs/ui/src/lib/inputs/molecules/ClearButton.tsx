import * as React from "react";

import Button, { ButtonProps } from "../atoms/Button";
import ClearIcon from "../../icons/atoms/ClearIcon";

export type ClearButtonProps = ButtonProps;

export type ClearButton = React.FunctionComponent<ClearButtonProps>;

export const ClearButton = (props: ClearButtonProps) => (
  <Button startIcon={<ClearIcon />} {...props}></Button>
);

export default ClearButton;