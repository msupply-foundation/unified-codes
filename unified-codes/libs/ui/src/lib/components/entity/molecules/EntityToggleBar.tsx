import * as React from 'react';

import Grid from '../../layout/atoms/Grid';
import ToggleButton from '../../inputs/molecules/ToggleButton';

import { EEntityType } from '@unified-codes/data';

export interface IEntityToggleBarProps {
  classes?: {
    root?: string,
    buttonContainer?: string,
    buttonActive?: string,
    buttonInactive?: string,
  };
  buttonTypes: EEntityType[],
  buttonStates: { [key in EEntityType]: boolean },
  buttonLabels: { [key in EEntityType]: string }
  onToggle: (property: EEntityType) => void;
}

export type EntityToggleBar = React.FunctionComponent<IEntityToggleBarProps>;

export const EntityToggleBar: EntityToggleBar = ({ classes, buttonTypes, buttonStates, buttonLabels, onToggle }) => {
  const buttons = buttonTypes.map((buttonType: EEntityType) => {
    const isSelected = buttonStates[buttonType];
    const label = buttonLabels[buttonType];

    return (
      <Grid item classes={{ root: classes?.buttonContainer }}>
        <ToggleButton 
          classes={{ root: isSelected ? classes?.buttonActive : classes?.buttonInactive }}
          isSelected={isSelected} 
          onClick={() => onToggle(buttonType)}
        >
          {label}
        </ToggleButton>
      </Grid>
    );
  });

  return (
    <Grid container classes={{ root: classes?.root }} justify="center" direction="row" spacing={2}>
      {buttons}
    </Grid>
  );
};

export default EntityToggleBar