import * as React from 'react';

import Button, { ButtonProps } from '../atoms/Button';
import AddIcon from '../../icons/atoms/AddIcon';
import CheckCircleIcon from '../../icons/atoms/CheckCircleIcon';

export interface ToggleButtonProps extends ButtonProps {
  isSelected?: boolean
}

export type ToggleButton = React.FunctionComponent<ToggleButtonProps>;

export const ToggleButton : ToggleButton = (props: ToggleButtonProps) => {
  const { isSelected } = props;
  const buttonStyle = isSelected ? 'toggleButtonPrimary' : 'toggleButtonSecondary';
  const startIcon = isSelected ? <CheckCircleIcon /> : <AddIcon />;
  return <Button startIcon= { startIcon }  {...props} className={buttonStyle}></Button>
};

export default ToggleButton;