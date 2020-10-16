import {
  DETAIL_ACTIONS,
  IDetailAction,
  IDetailUpdateEntityAction,
  IDetailUpdateSuccessAction,
  IDetailUpdateFailureAction,
} from '../actions';
import { IDetailState } from '../types';

const initialState: IDetailState = {
  loading: false,
};

export const DetailReducer = (state: IDetailState = initialState, action: IDetailAction) => {
  const { type } = action;

  switch (type) {
    case DETAIL_ACTIONS.UPDATE_ENTITY: {
      const { entity } = action as IDetailUpdateEntityAction;
      return { ...state, entity, loading: true };
    }
    case DETAIL_ACTIONS.UPDATE_ENTITY_SUCCESS: {
      const { entity } = action as IDetailUpdateSuccessAction;
      const { error } = initialState;
      return { ...state, entity, error: error, loading: false };
    }
    case DETAIL_ACTIONS.UPDATE_ENTITY_FAILURE: {
      const { error } = action as IDetailUpdateFailureAction;
      return { ...state, error, loading: false };
    }
  }

  return state;
};
