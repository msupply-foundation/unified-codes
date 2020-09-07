import * as React from 'react';
import { Theme, withStyles } from '@material-ui/core/styles';
import { ClassNameMap } from '@material-ui/core/styles/withStyles';

import ToggleButton from '../molecules/ToggleButton';
import Grid from '../../layout/atoms/Grid';

export interface EntityFilterProps {
  classes: ClassNameMap<any>;
}

const getStyles = (theme: Theme) => ({
  root: {
    backgroundColor: theme.palette.divider,
    padding: '12px 0px 12px 0px'
  }
});

export type EntityFilter = React.FunctionComponent<EntityFilterProps>;

export const _EntityFilter: EntityFilter = ({classes}) => {
  const onToggleSelected = () => (console.log('toggle clicked'));

  return <Grid container justify="center" direction="row" className={classes.root} spacing={2}>
    <Grid item>
      <ToggleButton onClick={onToggleSelected}>Drug</ToggleButton>
    </Grid>
    <Grid item>
      <ToggleButton onClick={onToggleSelected}>Unit of Use</ToggleButton>
    </Grid>
    <Grid item>
      <ToggleButton onClick={onToggleSelected}>Other</ToggleButton>
    </Grid>
  </Grid>
}

export const EntityFilter = withStyles(getStyles)(_EntityFilter);