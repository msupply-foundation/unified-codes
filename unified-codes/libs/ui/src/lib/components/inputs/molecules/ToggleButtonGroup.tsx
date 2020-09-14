import * as React from 'react';
import { Theme, withStyles } from '@material-ui/core/styles';
import { ClassNameMap } from '@material-ui/core/styles/withStyles';

import ToggleButton from '../molecules/ToggleButton';
import Grid from '../../layout/atoms/Grid';

export interface ToggleButtonGroupProps {
  classes: ClassNameMap<any>;
  toggleItems: ToggleableItem[];
  onToggle: (entity: ToggleableItem) => void;
}

interface ToggleableItem {
  name: string;
  active: boolean;
}

const getStyles = (theme: Theme) => ({
  root: {
    backgroundColor: theme.palette.divider,
    paddingTop: '12px',
    paddingBottom: '12px',
  },
});

export type ToggleButtonGroup = React.FunctionComponent<ToggleButtonGroupProps>;

export const _ToggleButtonGroup: ToggleButtonGroup = ({ classes, toggleItems, onToggle }) => {
  return (
    <Grid container justify="center" direction="row" className={classes.root} spacing={2}>
      {toggleItems.map((item) => {
        return (
          <Grid key={item.name} item>
            <ToggleButton isSelected={item.active} onClick={() => onToggle(item)}>
              {item.name}
            </ToggleButton>
          </Grid>
        );
      })}
    </Grid>
  );
};

export const ToggleButtonGroup = withStyles(getStyles)(_ToggleButtonGroup);
