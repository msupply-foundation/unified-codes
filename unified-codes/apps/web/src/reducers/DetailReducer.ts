import { DETAIL_ACTIONS, IDetailAction, IDetailUpdateEntityAction, IDetailFetchEntityAction, IDetailFetchSuccessAction, IDetailFetchFailureAction } from '../actions';
import { IDetailState } from '../types';

const initialState: IDetailState = {
  entity: null,
  loading: false
};

export const DetailReducer = (state: IDetailState = initialState, action: IDetailAction) => {
    const { type } = action;

    switch(type) {
        case DETAIL_ACTIONS.UPDATE_ENTITY: {
            const { entity } = action as IDetailUpdateEntityAction;
            return { ...state, entity }
        }
        case DETAIL_ACTIONS.FETCH_ENTITY: {
          return { ...state, loading: true }
        }
        case DETAIL_ACTIONS.FETCH_ENTITY_SUCCESS: {
          const { entity } = action as IDetailFetchSuccessAction;
          return { ...state, entity, error: initialState.error, loading: false };
        }
        case DETAIL_ACTIONS.FETCH_ENTITY_FAILURE: {
          const { error } = action as IDetailFetchFailureAction;
          return { ...state, error, loading: false };
        }
    }

    return state;
};
