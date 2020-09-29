import * as React from 'react';
import { connect } from 'react-redux';
import { Grid, withStyles } from '@material-ui/core';

import { EEntityType } from '@unified-codes/data';
import { EntityToggleBar } from '@unified-codes/ui';

import { ExplorerActions, IExplorerAction } from '../../actions';
import { ExplorerSelectors } from '../../selectors';
import { IState } from '../../types';
import { ITheme } from '../../muiTheme';
import ExplorerToggleButton from './ExplorerToggleButton';
import CheckCircleIcon from 'libs/ui/src/lib/components/icons/atoms/CheckCircleIcon';
import AddIcon from 'libs/ui/src/lib/components/icons/atoms/AddIcon';

const styles = (theme: ITheme) => ({

});

const mergeProps = ((stateProps: any, dispatchProps: any) => {
  const { buttonTypes, buttonStates } = stateProps;
  const { onToggle } = dispatchProps;

  const buttonLabels = {
    [EEntityType.DRUG]: 'Drug',
    [EEntityType.MEDICINAL_PRODUCT]: 'Medicinal product',
    [EEntityType.OTHER]: 'Other'
  }

  const buttons = buttonTypes.map((buttonType: EEntityType) => {
    const isSelected = buttonStates[buttonType];
  
    const startIcon = isSelected ? <CheckCircleIcon/> : <AddIcon/>;
    const color = buttonStates[buttonType] ? 'primary' : 'secondary';
    const label = buttonLabels[buttonType];
  
    return <ExplorerToggleButton startIcon={startIcon} color={color} onClick={() => onToggle(buttonType)}>{label}</ExplorerToggleButton>
  });

  return {
    buttons
  }
})

const mapDispatchToProps = (dispatch: React.Dispatch<IExplorerAction>) => {
    const onToggle = (type: EEntityType) => {
        switch(type) {
          case EEntityType.DRUG: {
            dispatch(ExplorerActions.toggleFilterByDrug());
            break;
          }
          case EEntityType.MEDICINAL_PRODUCT: {
            dispatch(ExplorerActions.toggleFilterByMedicinalProduct());
            break;
          }
          case EEntityType.OTHER: {
            dispatch(ExplorerActions.toggleFilterByOther());
            break;
          }
        }
    };
    return { onToggle };
};

const mapStateToProps = (state: IState) => {
    const buttonTypes = ExplorerSelectors.selectButtonTypes(state);
    const buttonStates = ExplorerSelectors.selectButtonStates(state);
    return { buttonTypes, buttonStates };
};

export const ExplorerToggleBar = connect(mapStateToProps, mapDispatchToProps, mergeProps)(withStyles(styles)(EntityToggleBar));

export default ExplorerToggleBar;