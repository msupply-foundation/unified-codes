import {
  IAuthenticatorAction,
  IAuthenticationSuccessAction,
  IUserAction,
  AUTHENTICATOR_ACTIONS,
} from '../actions';

import { IUserState } from '../types';

const initialState = () => {
  return {};
};

export const UserReducer = (
  state: IUserState = initialState(),
  action: IUserAction | IAuthenticatorAction
) => {
  const { type } = action;

  switch (type) {
    case AUTHENTICATOR_ACTIONS.AUTHENTICATION_SUCCESS: {
      const { user } = action as IAuthenticationSuccessAction;
      return user;
    }

    default:
      return state;
  }
};
