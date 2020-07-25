import * as React from 'react';
import { Button, ButtonProps } from './Button';
import { ClearIcon } from './ClearIcon';

export interface ClearButtonProps extends ButtonProps {};

export type ClearButton = React.FunctionComponent<ClearButtonProps>;

export const ClearButton = (props: ClearButtonProps) => <Button startIcon={<ClearIcon/>} {...props}/>;