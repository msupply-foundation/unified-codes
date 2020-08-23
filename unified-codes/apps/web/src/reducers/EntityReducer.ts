import { Entity } from '@unified-codes/data';
import { ENTITY_ACTIONS, IEntityAction } from '../actions/EntityActions';
import { log } from 'console';

const initialState = () => {
  const entities: Entity[] = [];
  return entities;
};

export const EntityReducer = (state = initialState(), action: IEntityAction) => {
  const { type } = action;

  switch (type) {
    case ENTITY_ACTIONS.UPDATE: {
      const { data } = action;
      const { entities } = data;
      return entities;
    }
    
    default:
      return state;
  }
};

export default EntityReducer;