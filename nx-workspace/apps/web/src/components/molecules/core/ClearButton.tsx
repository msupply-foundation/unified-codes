import * as React from 'react';
import { Button, ButtonProps, ClearIcon } from '../../atoms';

export interface ClearButtonProps extends ButtonProps {};

export type ClearButton = React.FunctionComponent<ClearButtonProps>;

export const ClearButton = (props: ClearButtonProps) => <Button startIcon={<ClearIcon/>} {...props}/>;