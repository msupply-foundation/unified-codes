<<<<<<< HEAD:web/src/components/atoms/core/ClearButton.tsx
import * as React from "react";
import { Button, ButtonProps } from "./Button";
import { ClearIcon } from "./ClearIcon";
=======
import * as React from 'react';
import { Button, ButtonProps, ClearIcon } from '../../atoms';
>>>>>>> master:web/src/components/molecules/core/ClearButton.tsx

export interface ClearButtonProps extends ButtonProps {}

export type ClearButton = React.FunctionComponent<ClearButtonProps>;

export const ClearButton = (props: ClearButtonProps) => (
  <Button startIcon={<ClearIcon />} {...props} />
);
