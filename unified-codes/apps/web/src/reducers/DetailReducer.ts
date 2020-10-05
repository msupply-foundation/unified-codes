import { IDetailState } from '../types';

const initialState = (): IDetailState => {
  const detail: IDetailState = {
    entity: null,
    loading: false,
  };
  return detail;
};

export const DetailReducer = (state: IDetailState = initialState(), action: any) => {
    return state;
};
