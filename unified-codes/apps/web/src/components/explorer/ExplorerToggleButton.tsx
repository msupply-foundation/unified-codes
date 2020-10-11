import { Button } from '@unified-codes/ui';

import { withStyles } from '../../styles';
import { ITheme } from '../../types';

const styles = (theme: ITheme) => ({
  textPrimary: {
    backgroundColor: theme.palette.action.active,
    '&:hover': {
      backgroundColor: theme.palette.action.selected
    }
  },
  textSecondary: {
    backgroundColor: theme.palette.action.selected,
    '&:hover': {
      backgroundColor: theme.palette.action.active
    }
  },
  root: {
    borderRadius: '16px',
    color: theme.palette.text.secondary,
    paddingRight: '12px',
    margin: '6px 0px 12px 6px',
  }
});

export const ExplorerToggleButton = withStyles(styles)(Button);

export default ExplorerToggleButton;