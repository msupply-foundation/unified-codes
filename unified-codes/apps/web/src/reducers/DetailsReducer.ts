import {
  DETAILS_ACTIONS,
  IDetailsAction,
  IDetailsFetchSuccessAction,
  IDetailsFetchFailureAction,
} from '../actions';
import { IDetailsState } from '../types';

const initialState = (): IDetailsState => {
  return {
    loading: false
  };
};

export const DetailsReducer = (
  state = initialState(),
  action: IDetailsAction
): IDetailsState => {
  const { type } = action;

  switch (type) {
    case DETAILS_ACTIONS.FETCH_ENTITY: {
      return { ...state, loading: true };
    }
    case DETAILS_ACTIONS.FETCH_SUCCESS: {
      const { entity } = action as IDetailsFetchSuccessAction;
      return { ...state, entity, error: initialState().error, loading: false };
    }
    case DETAILS_ACTIONS.FETCH_FAILURE: {
      const { error } = action as IDetailsFetchFailureAction;
      return { ...state, error, loading: false };
    }
    default:
      return state;
  }
};

export default DetailsReducer;
