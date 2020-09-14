import * as React from 'react';

import ToggleButton from '../molecules/ToggleButton';
import Grid from '../../layout/atoms/Grid';

export interface ToggleButtonGroupProps {
  className?: string;
  toggleItems: ToggleableItem[];
  onToggle: (entity: ToggleableItem) => void;
}

interface ToggleableItem {
  name: string;
  active: boolean;
}

export type ToggleButtonGroup = React.FunctionComponent<ToggleButtonGroupProps>;

export const ToggleButtonGroup: ToggleButtonGroup = ({ className, toggleItems, onToggle }) => {
  return (
    <Grid container justify="center" direction="row" className={className} spacing={2}>
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
