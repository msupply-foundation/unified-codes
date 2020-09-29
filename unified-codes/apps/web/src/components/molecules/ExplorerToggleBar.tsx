import * as React from 'react';
import { connect } from 'react-redux';

import { EEntityType } from '@unified-codes/data';
import { EntityToggleBar } from '@unified-codes/ui';

import { ExplorerActions, IExplorerAction } from '../../actions';
import { ExplorerSelectors } from '../../selectors';
import { IState } from '../../types';

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
    const buttonLabels = {
        [EEntityType.DRUG]: 'Drug',
        [EEntityType.MEDICINAL_PRODUCT]: 'Medicinal product',
        [EEntityType.OTHER]: 'Other'
    };

    const buttonTypes = ExplorerSelectors.selectButtonTypes(state);
    const buttonStates = ExplorerSelectors.selectButtonStates(state);

    return { buttonTypes, buttonStates, buttonLabels };
};

export const ExplorerToggleBar = connect(mapStateToProps, mapDispatchToProps)(EntityToggleBar);

export default ExplorerToggleBar;