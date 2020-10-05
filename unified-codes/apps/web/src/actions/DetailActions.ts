import { IEntity } from 'libs/data/src/lib';
import { Action } from 'redux';

export const DETAIL_ACTIONS = {
  UPDATE_ENTITY: 'detail/updateEntity',
};

export interface IDetailUpdateEntityAction extends Action<string> {
  entity: IEntity;
}

export type IDetailAction = IDetailUpdateEntityAction;

const updateEntity = (entity: IEntity) => ({
  type: DETAIL_ACTIONS.UPDATE_ENTITY,
  entity
});

export const DetailActions = {
    updateEntity
};

export default DetailActions;