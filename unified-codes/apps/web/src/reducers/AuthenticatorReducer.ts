import { IAuthenticatorAction, AUTHENTICATOR_ACTIONS } from '../actions';
import { IAuthenticatorState } from '../types';

const initialState = (): IAuthenticatorState => {
  return {
    isAuthenticating: false
  };
};

export const AuthenticatorReducer = (state: IAuthenticatorState = initialState(), action: IAuthenticatorAction) => {
  const { type } = action;

  switch (type) {
    case AUTHENTICATOR_ACTIONS.AUTHENTICATE: {
      return { isAuthenticating: true };
    }

    case AUTHENTICATOR_ACTIONS.AUTHENTICATION_SUCCESS:
    case AUTHENTICATOR_ACTIONS.AUTHENTICATION_FAILURE: {
      return { isAuthenticating: false };
    }

    default:
      return state;
  }
};
