import * as React from 'react';
import { batch, connect } from 'react-redux';

import { CheckCircleIcon, AddIcon, Grid } from '@unified-codes/ui/components';
import { withStyles } from '@unified-codes/ui/styles';
import { EEntityCategory } from '@unified-codes/data/v1';

import ExplorerToggleButton from './ExplorerToggleButton';

import { ExplorerActions, IExplorerAction } from '../../../actions';
import { ExplorerSelectors } from '../../../selectors';
import { IState } from '../../../types';
import { ITheme } from '../../../styles';

const styles = (_: ITheme) => ({});

export interface ExplorerToggleBarProps {
  classes?: {
    root?: string;
  };
  buttons: React.ReactElement[];
}

export type ExplorerToggleBar = React.FunctionComponent<ExplorerToggleBarProps>;

const ExplorerToggleBarComponent: ExplorerToggleBar = ({ classes, buttons }) => {
  const toggleButtons = buttons.map((button) => (
    <Grid item key={button?.key as React.ReactText}>
      {button}
    </Grid>
  ));

  return (
    <Grid container classes={classes} justify="center" direction="row" spacing={2}>
      {toggleButtons}
    </Grid>
  );
};

const mergeProps = (stateProps: any, dispatchProps: any) => {
  const { filterByDrug, filterByConsumable, filterByOther } = stateProps;
  const {
    onToggleFilterByDrug,
    onToggleFilterByConsumable,
    onToggleFilterByOther,
  } = dispatchProps;

  const drugButtonLabel = 'Drugs';
  const drugButtonKey = EEntityCategory.DRUG;
  const drugButtonColor = filterByDrug ? 'primary' : 'secondary';
  const drugButtonStartIcon = filterByDrug ? <CheckCircleIcon /> : <AddIcon />;
  const drugButtonOnClick = onToggleFilterByDrug;

  const consumableButtonLabel = 'Consumables';
  const consumableButtonKey = EEntityCategory.CONSUMABLE;
  const consumableButtonColor = filterByConsumable ? 'primary' : 'secondary';
  const consumableButtonStartIcon = filterByConsumable ? (
    <CheckCircleIcon />
  ) : (
    <AddIcon />
  );
  const consumableButtonOnClick = onToggleFilterByConsumable;

  const otherButtonLabel = 'Other';
  const otherButtonKey = EEntityCategory.OTHER;
  const otherButtonColor = filterByOther ? 'primary' : 'secondary';
  const otherButtonStartIcon = filterByOther ? <CheckCircleIcon /> : <AddIcon />;
  const otherButtonOnClick = onToggleFilterByOther;

  const ToggleButtonDrug = (
    <ExplorerToggleButton
      key={drugButtonKey}
      startIcon={drugButtonStartIcon}
      color={drugButtonColor}
      onClick={drugButtonOnClick}
    >
      {drugButtonLabel}
    </ExplorerToggleButton>
  );

  const ToggleButtonConsumable = (
    <ExplorerToggleButton
      key={consumableButtonKey}
      startIcon={consumableButtonStartIcon}
      color={consumableButtonColor}
      onClick={consumableButtonOnClick}
    >
      {consumableButtonLabel}
    </ExplorerToggleButton>
  );

  const ToggleButtonOther = (
    <ExplorerToggleButton
      key={otherButtonKey}
      startIcon={otherButtonStartIcon}
      color={otherButtonColor}
      onClick={otherButtonOnClick}
    >
      {otherButtonLabel}
    </ExplorerToggleButton>
  );

  return { buttons: [ToggleButtonDrug, ToggleButtonConsumable, ToggleButtonOther] };
};

const mapDispatchToProps = (dispatch: React.Dispatch<IExplorerAction>) => {
  const onToggleFilterByDrug = () =>
    batch(() => {
      dispatch(ExplorerActions.resetPage());
      dispatch(ExplorerActions.toggleFilterByDrug());
      dispatch(ExplorerActions.updateEntities());
    });

  const onToggleFilterByConsumable = () =>
    batch(() => {
      dispatch(ExplorerActions.resetPage());
      dispatch(ExplorerActions.toggleFilterByConsumable());
      dispatch(ExplorerActions.updateEntities());
    });

  const onToggleFilterByOther = () =>
    batch(() => {
      dispatch(ExplorerActions.resetPage());
      dispatch(ExplorerActions.toggleFilterByOther());
      dispatch(ExplorerActions.updateEntities());
    });

  return { onToggleFilterByDrug, onToggleFilterByConsumable, onToggleFilterByOther };
};

const mapStateToProps = (state: IState) => {
  const filterByDrug = ExplorerSelectors.selectFilterByDrug(state);
  const filterByConsumable = ExplorerSelectors.selectFilterByConsumable(state);
  const filterByOther = ExplorerSelectors.selectFilterByOther(state);

  return { filterByDrug, filterByConsumable, filterByOther };
};

export const ExplorerToggleBar = connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(withStyles(styles)(ExplorerToggleBarComponent));

export default ExplorerToggleBar;
