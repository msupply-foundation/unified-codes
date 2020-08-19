import { Action } from 'redux';

import { IEntity } from "@unified-codes/data";

export const ENTITY_ACTIONS = {
  UPDATE: 'entityActions/updateEntities',
};

export interface IEntityUpdateEntitiesAction extends Action<string> {
    data: { entities: IEntity[] },
};

export type IEntityAction = IEntityUpdateEntitiesAction;

const updateEntities = (data: { entities: IEntity[] }) => ({
  type: ENTITY_ACTIONS.UPDATE,
  data,
});

export default {
  updateEntities,
};
