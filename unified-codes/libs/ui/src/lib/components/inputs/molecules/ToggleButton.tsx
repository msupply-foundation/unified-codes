import * as React from 'react';

import Button, { ButtonProps } from '../atoms/Button';
import AddIcon from '../../icons/atoms/AddIcon';
import CheckCircleIcon from '../../icons/atoms/CheckCircleIcon';

const styles = {
  toggleButtonPrimary: {
    backgroundColor: '#2B83A1',
  },
  toggleButtonSecondary: {
    backgroundColor: '#5CCDF4'
  }
}

export interface ToggleButtonProps extends ButtonProps {
  isSelected?: boolean
}

export type ToggleButton = React.FunctionComponent<ToggleButtonProps>;

export const ToggleButton : ToggleButton = (props: ToggleButtonProps) => {
  const { isSelected } = props;
  const buttonStyle = isSelected ? styles.toggleButtonPrimary : styles.toggleButtonSecondary;
  const startIcon = isSelected ? <CheckCircleIcon /> : <AddIcon />;
  return <Button startIcon= { startIcon }  {...props} style={buttonStyle}></Button>
};

export default ToggleButton;