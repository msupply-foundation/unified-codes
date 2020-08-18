import { IAuthenticator } from '@unified-codes/data';

import { IAuthenticatorAction, AUTHENTICATOR_ACTIONS } from '../actions/AuthenticatorActions';

const initialState = () => {
  const authentication: IAuthenticator = {
    isAuthenticating: false,
  }
};

export const AuthenticatorReducer = (state = initialState(), action: IAuthenticatorAction) => {
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
