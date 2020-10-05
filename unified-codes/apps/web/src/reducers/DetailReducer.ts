import { DETAIL_ACTIONS, IDetailAction, IDetailUpdateEntityAction } from '../actions';
import { IDetailState } from '../types';

const initialState = (): IDetailState => {
  const detail: IDetailState = {
    entity: null,
    loading: false,
  };
  return detail;
};

export const DetailReducer = (state: IDetailState = initialState(), action: IDetailAction) => {
    const { type } = action;

    switch(type) {
        case DETAIL_ACTIONS.UPDATE_ENTITY: {
            const { entity } = action as IDetailUpdateEntityAction;
            return { ...state, entity }
        }
    }

    return state;
};
