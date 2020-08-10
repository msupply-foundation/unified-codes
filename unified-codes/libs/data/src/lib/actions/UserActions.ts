import { Action } from "redux";
import { IUser, IUserAuthentication, IMessage } from "../types";

export const USER_ACTIONS = {
  LOG_IN: "userActions/login",
  LOG_IN_SUCCESS: "userActions/loginSuccess",
  LOG_IN_FAILURE: "userActions/loginFailure",
  LOG_OUT: "userActions/logout",
};

export interface IUserAction extends Action<string> {
  user: IUser;
}
export interface IUserAuthenticationAction extends Action<string> {
  auth: IUserAuthentication;
}

const login = (auth: IUserAuthentication) => ({
  type: USER_ACTIONS.LOG_IN,
  auth,
});

const loginSuccess = (user: IUser) => ({
  type: USER_ACTIONS.LOG_IN_SUCCESS,
  user,
});

const loginFailure = (message: string) => {
  const action: IMessage = {
    severity: "error",
    text: message,
  };
  return {
    type: USER_ACTIONS.LOG_IN_FAILURE,
    message,
  };
};

const logout = () => ({ type: USER_ACTIONS.LOG_OUT });

export const UserActions = {
  login,
  loginSuccess,
  loginFailure,
  logout,
};
