import * as React from 'react';
import { Theme, withStyles } from '@material-ui/core/styles';
import { ClassNameMap } from '@material-ui/core/styles/withStyles';

import Button, { ButtonProps } from '../atoms/Button';
import AddIcon from '../../icons/atoms/AddIcon';
import CheckCircleIcon from '../../icons/atoms/CheckCircleIcon';

const getStyles = (theme: Theme) => ({
  textPrimary: {
    backgroundColor: theme.palette.action.active,
  },
  textSecondary: {
    backgroundColor: theme.palette.action.selected,
  },
  root: {
    borderRadius: '16px',
    color: theme.palette.text.secondary
  }
});

export interface ToggleButtonProps extends ButtonProps {
  classes: ClassNameMap<any>;
  isSelected?: boolean;
}

export type ToggleButton = React.FunctionComponent<ToggleButtonProps>;

export const ToggleButton: ToggleButton = (props: ToggleButtonProps) => {
  const onToggleButtonChange = () => (console.log('toggle clicked'));

  const { isSelected } = props;
  const { classes } = props;
  const startIcon = isSelected ? <CheckCircleIcon /> : <AddIcon />;
  const className = isSelected ? classes.textPrimary : classes.textSecondary;
  return <Button startIcon={startIcon} {...props} className={className} onClick={ onToggleButtonChange }></Button>;
};

export default withStyles(getStyles)(ToggleButton);
