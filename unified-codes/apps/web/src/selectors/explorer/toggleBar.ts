import { createSelector } from 'reselect';

import { IState, IExplorerToggleBarState } from '../../types';
import { EEntityType } from 'libs/data/src/lib';

export const selectToggleBar = (state: IState): IExplorerToggleBarState => state.explorer.toggleBar;

export const selectButtonTypes = createSelector(
  selectToggleBar,
  (toggleBar: IExplorerToggleBarState): EEntityType[] => toggleBar?.buttonTypes
);

export const selectButtonStates = createSelector(
    selectToggleBar,
    (toggleBar: IExplorerToggleBarState): { [key in EEntityType]: boolean} => toggleBar?.buttonStates
  );
  

export const toggleBarSelectors = {
    selectButtonTypes,
    selectButtonStates,
};

export default toggleBarSelectors;
