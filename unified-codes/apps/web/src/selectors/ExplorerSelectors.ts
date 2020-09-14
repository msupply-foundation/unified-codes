import { createSelector } from 'reselect';

import { IEntityCollection, IExplorerVariables } from '@unified-codes/data';

import { IState, IExplorerState } from '../types';

export const explorerSelector = (state: IState): IExplorerState => state.explorer;

export const variablesSelector = createSelector(
  explorerSelector,
  (explorer: IExplorerState): IExplorerVariables | undefined => explorer.variables
);

export const entitiesSelector = createSelector(
  explorerSelector,
  (explorer: IExplorerState): IEntityCollection | undefined => explorer.entities
);

export const ExplorerSelectors = {
  explorerSelector,
  variablesSelector,
  entitiesSelector,
};

export default ExplorerSelectors;
