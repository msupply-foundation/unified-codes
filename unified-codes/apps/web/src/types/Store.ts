import { IUser, EEntityField, IEntity, EEntityType, EEntityCategory } from '@unified-codes/data/v1';

import { IAlert } from './Alert';

export type IAlertState = IAlert | {};

export interface IAuthenticatorState {
  isAuthenticating?: boolean;
}

export interface IExplorerSearchBarState {
  input: string;
  filterBy: EEntityField;
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
  [EEntityCategory.DRUG]: boolean;
  [EEntityCategory.CONSUMABLE]: boolean;
  [EEntityCategory.OTHER]: boolean;
}

export interface IDetailState {
  entity?: IEntity;
  error?: Error;
  loading?: boolean;
}

export interface IExplorerState {
  searchBar: IExplorerSearchBarState;
  table: IExplorerTableState;
  toggleBar: IExplorerToggleBarState;
}

export type IUserState = IUser | {};

export interface IState {
  alert: IAlertState;
  user: IUserState;
  detail: IDetailState;
  explorer: IExplorerState;
  authenticator: IAuthenticatorState;
}
