import { IAlert, IEntityCollection, IExplorerVariables, IUser } from '@unified-codes/data';

export type IAlertState = IAlert | {};

export interface IAuthenticatorState {
  isAuthenticating?: boolean;
}

export interface IExplorerState {
  entities?: IEntityCollection;
  error?: Error;
  loading?: boolean;
  variables?: IExplorerVariables;
}

export type IUserState = IUser | {};

export interface IState {
  alert: IAlertState;
  user: IUserState;
  explorer: IExplorerState;
  authenticator: IAuthenticatorState;
}
