import * as React from 'react';

import Button, { ButtonProps } from '../atoms/Button';
import AddIcon from '../../icons/atoms/AddIcon';
import CheckCircleIcon from '../../icons/atoms/CheckCircleIcon';

export interface ToggleButtonProps extends ButtonProps {
  classes: { root: string },
  isSelected?: boolean;
}

export type ToggleButton = React.FunctionComponent<ToggleButtonProps>;

export const ToggleButton: ToggleButton = (props: ToggleButtonProps) => {
  const { classes, isSelected, ...buttonProps } = props;
  const startIcon = isSelected ? <CheckCircleIcon /> : <AddIcon />;
  return <Button startIcon={startIcon} classes={{ root: classes?.root }} {...buttonProps}></Button>;
};

export default ToggleButton;
