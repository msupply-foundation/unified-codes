import * as React from 'react';
import { Theme, withStyles } from '@material-ui/core/styles';

import Button, { ButtonProps } from '../atoms/Button';
import AddIcon from '../../icons/atoms/AddIcon';
import CheckCircleIcon from '../../icons/atoms/CheckCircleIcon';
const getStyles = (theme: Theme) => ({
  textPrimary: {
    backgroundColor: theme.palette.action.active,
    color: theme.palette.text.primary,
  },
  textSecondary: {
    backgroundColor: theme.palette.action.selected,
    color: theme.palette.text.primary,
  },
  root: {
    borderRadius: '16px'
  }
});

export interface ToggleButtonProps extends ButtonProps {
  isSelected?: boolean;
}

export type ToggleButton = React.FunctionComponent<ToggleButtonProps>;

export const ToggleButton: ToggleButton = (props: ToggleButtonProps) => {
  const { isSelected } = props;
  const startIcon = isSelected ? <CheckCircleIcon /> : <AddIcon />;
  props.color = isSelected ? 'primary' : 'secondary';
  return <Button startIcon={startIcon} {...props}></Button>;
};

export default withStyles(getStyles)(ToggleButton);
