import { IAlert, IEntityCollection, IExplorerVariables, IUser, EEntityField, IEntity, EEntityType } from '@unified-codes/data';

export type IAlertState = IAlert | {};

export interface IAuthenticatorState {
  isAuthenticating?: boolean;
}

export interface IExplorerSearchBarState {
  input: string;
  label: string;
}

export interface IExplorerTableState {
  count: number;
  loading: boolean;
  orderBy: EEntityField;
  orderDesc: boolean;
  rowsPerPage: number;
  page: number;
  entities: IEntity[];
}

export interface IExplorerToggleBarState {
  buttonStates: { [key in EEntityType]: boolean };
  buttonTypes: EEntityType[];
}

export interface IExplorerState {
  entities?: IEntityCollection;
  error?: Error;
  loading?: boolean;
  variables?: IExplorerVariables;
  searchBar: IExplorerSearchBarState;
  table: IExplorerTableState;
  toggleBar: IExplorerToggleBarState;
}

export type IUserState = IUser | {};


export interface IState {
  alert: IAlertState;
  user: IUserState;
  explorer: IExplorerState;
  authenticator: IAuthenticatorState;
}

