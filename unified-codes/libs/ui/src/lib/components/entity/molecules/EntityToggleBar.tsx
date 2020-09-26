import * as React from 'react';

import { EEntityType } from '@unified-codes/data';

import AddIcon from '../../icons/atoms/AddIcon';
import Button from '../../inputs/atoms/Button';
import CheckCircleIcon from '../../icons/atoms/CheckCircleIcon';
import Grid from '../../layout/atoms/Grid';

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

    const buttonClasses = isSelected ? { root: classes?.buttonActive } : { root: classes?.buttonInactive };
    const buttonIcon = isSelected ? <CheckCircleIcon /> : <AddIcon />;
    const buttonOnClick = () => onToggle(buttonType);

    return (
      <Grid item classes={{ root: classes?.buttonContainer }}>
        <Button 
          classes={buttonClasses}
          startIcon={buttonIcon}
          onClick={buttonOnClick}
        >
          {label}
        </Button>
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