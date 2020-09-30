import * as React from 'react';

import { EEntityType } from '@unified-codes/data';

import AddIcon from '../../icons/atoms/AddIcon';
import Button from '../../inputs/atoms/Button';
import CheckCircleIcon from '../../icons/atoms/CheckCircleIcon';
import Grid, { GridClasses } from '../../layout/atoms/Grid';

export interface IEntityToggleBarProps {
  classes?: GridClasses;
  buttons: React.ReactElement[]
}

export type EntityToggleBar = React.FunctionComponent<IEntityToggleBarProps>;

export const EntityToggleBar: EntityToggleBar = ({ classes, buttons }) => (
  <Grid container classes={classes} justify="center" direction="row" spacing={2}>
    {buttons.map(button => <Grid item key={button.key}>{button}</Grid>)}
  </Grid>
);

export default EntityToggleBar