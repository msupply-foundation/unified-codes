import { Action } from "redux";
import { IUser } from "../types";

export const USER_ACTIONS = {
  LOG_IN: "userActions/login",
  LOG_OUT: "userActions/logout",
};

export interface IUserAction extends Action<string> {
  user: IUser;
}

const login = (user: IUser) => ({ type: USER_ACTIONS.LOG_IN, user });
const logout = () => ({ type: USER_ACTIONS.LOG_OUT });

export const UserActions = {
  login,
  logout,
};
