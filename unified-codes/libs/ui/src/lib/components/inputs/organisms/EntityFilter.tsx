import * as React from 'react';

import ToggleButton from '../molecules/ToggleButton';
import Grid from '../../layout/atoms/Grid';

import { Theme, withStyles } from '@material-ui/core/styles';


export interface EntityFilterProps {

}

export type EntityFilter = React.FunctionComponent<EntityFilterProps>;

export const EntityFilter: EntityFilter = () => (
  <Grid container justify="center" direction="row" spacing={2}>
    <Grid item>
      <ToggleButton isSelected={true}>Drug</ToggleButton>
    </Grid>
    <Grid item>
      <ToggleButton>Unit of Use</ToggleButton>
    </Grid>
    <Grid item>
      <ToggleButton>Other</ToggleButton>
    </Grid>
  </Grid>
)

export default EntityFilter;