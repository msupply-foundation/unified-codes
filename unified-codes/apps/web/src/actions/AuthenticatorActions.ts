import { Action } from 'redux';

import { IUserCredentials, IUser, User } from '@unified-codes/data';

export const AUTHENTICATOR_ACTIONS = {
  AUTHENTICATE: 'authenticatorActions/login',
  AUTHENTICATION_SUCCESS: 'authenticatorActions/loginSuccess',
  AUTHENTICATION_FAILURE: 'authenticatorActions/loginFailure',
};

export interface IAuthenticateAction extends Action<string> {
  credentials: IUserCredentials,
};

export interface IAuthenticationSuccessAction extends Action<String> {
  user: IUser,
};

export interface IAuthenticationFailureAction extends Action<string> {
  error: string,
};

export type IAuthenticatorAction = IAuthenticateAction | IAuthenticationSuccessAction | IAuthenticationFailureAction;

const authenticate = (credentials: IUserCredentials) => ({
  type: AUTHENTICATOR_ACTIONS.AUTHENTICATE,
  credentials,
});

const authenticationSuccess = (user: User) => ({
  type: AUTHENTICATOR_ACTIONS.AUTHENTICATION_SUCCESS,
  user,
});

const authenticationFailure = (error: string) => {
  return {
    type: AUTHENTICATOR_ACTIONS.AUTHENTICATION_FAILURE,
    error,
  };
};

export default {
  authenticate,
  authenticationSuccess,
  authenticationFailure,
};
