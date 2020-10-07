import * as React from 'react';
import { batch, connect } from 'react-redux';

import { EEntityType } from '@unified-codes/data';
import { CheckCircleIcon, AddIcon, EntityToggleBar } from '@unified-codes/ui';

import ExplorerToggleButton from './ExplorerToggleButton';

import { ExplorerActions, IExplorerAction } from '../../actions';
import { ExplorerSelectors } from '../../selectors';
import { withStyles } from '../../styles';
import { IState, ITheme } from '../../types';

const styles = (_: ITheme) => ({});

const mergeProps = ((stateProps: any, dispatchProps: any) => {
  const { filterByDrug, filterByMedicinalProduct, filterByOther } = stateProps;
  const { onToggleFilterByDrug, onToggleFilterByMedicinalProduct, onToggleFilterByOther } = dispatchProps;

  const drugButtonLabel = 'Drug';
  const drugButtonKey = EEntityType.DRUG;
  const drugButtonColor = filterByDrug ? 'primary' : 'secondary';
  const drugButtonStartIcon = filterByDrug ? <CheckCircleIcon /> : <AddIcon />;
  const drugButtonOnClick = onToggleFilterByDrug;

  const medicinalProductButtonLabel = 'Medicinal product';
  const medicinalProductButtonKey = EEntityType.MEDICINAL_PRODUCT;
  const medicinalProductButtonColor = filterByMedicinalProduct ? 'primary' : 'secondary';
  const medicinalProductButtonStartIcon = filterByMedicinalProduct ? <CheckCircleIcon /> : <AddIcon />;
  const medicinalProductButtonOnClick = onToggleFilterByMedicinalProduct;

  const otherButtonLabel = 'Other';
  const otherButtonKey = EEntityType.OTHER;
  const otherButtonColor = filterByOther ? 'primary' : 'secondary';
  const otherButtonStartIcon = filterByOther ? <CheckCircleIcon /> : <AddIcon />;
  const otherButtonOnClick = onToggleFilterByOther;

  const ToggleButtonDrug = (
    <ExplorerToggleButton
      key={drugButtonKey}
      startIcon={drugButtonStartIcon}
      color={drugButtonColor}
      onClick={drugButtonOnClick}
    >{drugButtonLabel}</ExplorerToggleButton>
  );

  const ToggleButtonMedicinalProduct = (
    <ExplorerToggleButton
      key={medicinalProductButtonKey}
      startIcon={medicinalProductButtonStartIcon}
      color={medicinalProductButtonColor}
      onClick={medicinalProductButtonOnClick}
    >{medicinalProductButtonLabel}</ExplorerToggleButton>
  );

  const ToggleButtonOther = (
    <ExplorerToggleButton
      key={otherButtonKey}
      startIcon={otherButtonStartIcon}
      color={otherButtonColor}
      onClick={otherButtonOnClick}
    >{otherButtonLabel}</ExplorerToggleButton>
  );

  return { buttons: [ToggleButtonDrug, ToggleButtonMedicinalProduct, ToggleButtonOther] };
})

const mapDispatchToProps = (dispatch: React.Dispatch<IExplorerAction>) => {
  const onToggleFilterByDrug = () => batch(() => {
    dispatch(ExplorerActions.toggleFilterByDrug());
    dispatch(ExplorerActions.updateEntities());
  });

  const onToggleFilterByMedicinalProduct = () => batch(() => {
    dispatch(ExplorerActions.toggleFilterByMedicinalProduct());
    dispatch(ExplorerActions.updateEntities())
  });

  const onToggleFilterByOther =  () => batch(() => { 
    dispatch(ExplorerActions.toggleFilterByOther());
    dispatch(ExplorerActions.updateEntities())
  });

  return { onToggleFilterByDrug, onToggleFilterByMedicinalProduct, onToggleFilterByOther };
};

const mapStateToProps = (state: IState) => {
  const filterByDrug = ExplorerSelectors.selectFilterByDrug(state);
  const filterByMedicinalProduct = ExplorerSelectors.selectFilterByMedicinalProduct(state);
  const filterByOther = ExplorerSelectors.selectFilterByOther(state);

  return { filterByDrug, filterByMedicinalProduct, filterByOther };
};

export const ExplorerToggleBar = connect(mapStateToProps, mapDispatchToProps, mergeProps)(withStyles(styles)(EntityToggleBar));

export default ExplorerToggleBar;