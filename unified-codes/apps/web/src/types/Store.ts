import { IAlert, IEntity, IUser } from '@unified-codes/data';

export type IAlertState = IAlert | {};

export interface IAuthenticatorState {
    isAuthenticating?: boolean,
};

export type IExplorerData = IEntity[];

export interface IExplorerVariables { code?: string, description?: string };

export interface IExplorerState {
    data?: IExplorerData,
    error?: Error,
    loading?: boolean,
    variables?: IExplorerVariables,
};

export type IUserState = IUser | {};

export interface IState {
    alert: IAlertState,
    user: IUserState,
    explorer: IExplorerState,
    authenticator: IAuthenticatorState,
};

