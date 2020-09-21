import * as React from 'react';

import ToggleButton from '../molecules/ToggleButton';
import Grid from '../../layout/atoms/Grid';

export interface ToggleButtonGroupProps {
  classes?: any;
  toggleItems: IToggleItem[];
  onToggle: (item: IToggleItem) => void;
}

export interface IToggleItem {
  name: string;
  active: boolean;
}

export type ToggleButtonGroup = React.FunctionComponent<ToggleButtonGroupProps>;

export const ToggleButtonGroup: ToggleButtonGroup = ({ classes, toggleItems, onToggle }) => {
  return (
    <Grid container justify="center" direction="row" className={classes.root} spacing={2}>
      {toggleItems.map((item) => {
        return (
          <Grid key={item.name} item>
            <ToggleButton classes={{ root: item.active ? classes?.toggleButtonActive : classes?.toggleButtonInactive }} isSelected={item.active} onClick={() => onToggle(item)}>
              {item.name}
            </ToggleButton>
          </Grid>
        );
      })}
    </Grid>
  );
};
