import * as React from 'react';
import { connect } from 'react-redux';

import { EEntityType } from '@unified-codes/data';
import { EntityToggleBar } from '@unified-codes/ui';

import { toggleBarActions, IToggleBarAction } from '../../actions/explorer';
import { toggleBarSelectors } from '../../selectors/explorer';
import { IState } from '../../types';

const mapDispatchToProps = (dispatch: React.Dispatch<IToggleBarAction>) => {
    const onToggle = (type: EEntityType) => {
        switch(type) {
          case EEntityType.DRUG: {
            dispatch(toggleBarActions.toggleFilterByDrug());
            break;
          }
          case EEntityType.UNIT_OF_USE: {
            dispatch(toggleBarActions.toggleFilterByUnitOfUse());
            break;
          }
          case EEntityType.OTHER: {
            dispatch(toggleBarActions.toggleFilterByOther());
            break;
          }
        }
    };
    return { onToggle };
};

const mapStateToProps = (state: IState) => {
    const buttonLabels = {
        [EEntityType.DRUG]: 'Drug',
        [EEntityType.UNIT_OF_USE]: 'Unit of use',
        [EEntityType.OTHER]: 'Other'
    };

    const buttonTypes = toggleBarSelectors.selectButtonTypes(state);
    const buttonStates = toggleBarSelectors.selectButtonStates(state);

    return { buttonTypes, buttonStates, buttonLabels };
};

export const ExplorerToggleBar = connect(mapStateToProps, mapDispatchToProps)(EntityToggleBar);

export default ExplorerToggleBar;