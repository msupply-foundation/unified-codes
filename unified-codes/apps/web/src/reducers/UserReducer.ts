import { IUserAction } from '../actions/UserActions';

import { IAuthenticatorAction, IAuthenticationSuccessAction, AUTHENTICATOR_ACTIONS } from '../actions/AuthenticatorActions';

const initialState = () => {
  return {};
};

export const UserReducer = (state = initialState(), action: IUserAction | IAuthenticatorAction) => {
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