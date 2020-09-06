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
      <ToggleButton isSelected={true} label="Drug" />
    </Grid>
    <Grid item>
      <ToggleButton label="Unit of Use"/>
    </Grid>
    <Grid item>
      <ToggleButton label="Other" />
    </Grid>
  </Grid>
)

export default EntityFilter;