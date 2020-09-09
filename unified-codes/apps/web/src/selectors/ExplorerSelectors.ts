import { createSelector } from 'reselect';

import { IEntity, IExplorerVariables, Entity } from '@unified-codes/data';

import { IState, IExplorerState, IExplorerData } from '../types';

export const explorerSelector = (state: IState): IExplorerState => state.explorer;

export const variablesSelector = createSelector(
  explorerSelector,
  (explorer: IExplorerState): IExplorerVariables | undefined => explorer.variables
);

export const dataSelector = createSelector(
  explorerSelector,
  (explorer: IExplorerState): IExplorerData | undefined => explorer.entities
);

export const entitiesSelector = createSelector(
  variablesSelector,
  dataSelector,
  (variables?: IExplorerVariables, entities?: IExplorerData) => {
    const { code = '', description = '' } = variables ?? {};
    const allEntities: Entity[] =
      entities?.data?.map((entity: IEntity) => new Entity(entity)) ?? [];
    // TODO: push this filter down
    const filteredEntities: Entity[] = allEntities.filter(
      (entity: Entity) => entity.matchesCode(code) || entity.matchesDescription(description)
    );
    return {
      ...entities,
      data: filteredEntities,
    };
  }
);

export const ExplorerSelectors = {
  explorerSelector,
  variablesSelector,
  dataSelector,
  entitiesSelector,
};

export default ExplorerSelectors;
