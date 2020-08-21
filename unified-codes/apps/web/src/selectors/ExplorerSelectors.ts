import { createSelector } from 'reselect';

import { IEntity, Entity } from '@unified-codes/data';

import { IState, IExplorerState, IExplorerData, IExplorerVariables } from '../types';

export const explorerSelector = (state: IState): IExplorerState => state.explorer;

export const variablesSelector = createSelector(explorerSelector, (explorer: IExplorerState): IExplorerVariables | undefined => explorer.variables);

export const dataSelector = createSelector(explorerSelector, (explorer: IExplorerState): IExplorerData | undefined => explorer.data);

export const entitiesSelector = createSelector(variablesSelector, dataSelector, (variables?: IExplorerVariables, data?: IExplorerData) => {
    const { code = '', description = '' } = variables ?? {};
    const allEntities: Entity[] = data?.map((entity: IEntity) => new Entity(entity)) ?? [];
    const filteredEntities: Entity[] = allEntities.filter((entity: Entity) => entity.matchesCode(code) || entity.matchesDescription(description));
    return filteredEntities;
});

export const ExplorerSelectors = {
    explorerSelector,
    variablesSelector,
    dataSelector,
    entitiesSelector
};

export default ExplorerSelectors;