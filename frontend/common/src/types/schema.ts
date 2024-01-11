export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: string; output: string; }
};

export type AcceptUserInviteInput = {
  displayName: Scalars['String']['input'];
  password: Scalars['String']['input'];
  username: Scalars['String']['input'];
};

export type AccessDenied = LogoutErrorInterface & {
  __typename: 'AccessDenied';
  description: Scalars['String']['output'];
  fullError: Scalars['String']['output'];
};

export type AuthToken = {
  __typename: 'AuthToken';
  /** Bearer token */
  token: Scalars['String']['output'];
};

export type AuthTokenError = {
  __typename: 'AuthTokenError';
  error: AuthTokenErrorInterface;
};

export type AuthTokenErrorInterface = {
  description: Scalars['String']['output'];
};

export type AuthTokenResponse = AuthToken | AuthTokenError;

export enum ChangeTypeNode {
  Change = 'CHANGE',
  New = 'NEW'
}

export type CreateUserAccountInput = {
  displayName?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['String']['input'];
  password: Scalars['String']['input'];
  permissions: Array<PermissionNode>;
  username: Scalars['String']['input'];
};

export type CreateUserAccountResponse = UserAccountNode;

export type DatabaseError = RefreshTokenErrorInterface & {
  __typename: 'DatabaseError';
  description: Scalars['String']['output'];
  fullError: Scalars['String']['output'];
};

export type DeleteResponse = {
  __typename: 'DeleteResponse';
  id: Scalars['String']['output'];
};

export type DeleteUserAccountResponse = DeleteResponse;

export type DrugInteractionType = {
  __typename: 'DrugInteractionType';
  description: Scalars['String']['output'];
  name: Scalars['String']['output'];
  rxcui: Scalars['String']['output'];
  severity: Scalars['String']['output'];
  source: Scalars['String']['output'];
};

export type EntityCollectionType = {
  __typename: 'EntityCollectionType';
  data: Array<EntityType>;
  totalLength: Scalars['Int']['output'];
};

export type EntitySearchInput = {
  categories?: InputMaybe<Array<Scalars['String']['input']>>;
  code?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  match?: InputMaybe<Scalars['String']['input']>;
  orderBy?: InputMaybe<EntitySortInput>;
  search?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
};

export type EntitySortInput = {
  descending?: InputMaybe<Scalars['Boolean']['input']>;
  field: Scalars['String']['input'];
};

export type EntityType = {
  __typename: 'EntityType';
  children: Array<EntityType>;
  code: Scalars['String']['output'];
  description: Scalars['String']['output'];
  interactions?: Maybe<Array<DrugInteractionType>>;
  name: Scalars['String']['output'];
  parents: Array<EntityType>;
  product?: Maybe<EntityType>;
  properties: Array<PropertiesType>;
  type: Scalars['String']['output'];
  uid: Scalars['String']['output'];
};

export type EqualFilterLogTypeInput = {
  equalAny?: InputMaybe<Array<LogNodeType>>;
  equalTo?: InputMaybe<LogNodeType>;
  notEqualTo?: InputMaybe<LogNodeType>;
};

export type EqualFilterStringInput = {
  equalAny?: InputMaybe<Array<Scalars['String']['input']>>;
  equalTo?: InputMaybe<Scalars['String']['input']>;
  notEqualTo?: InputMaybe<Scalars['String']['input']>;
};

export type FullMutation = {
  __typename: 'FullMutation';
  /** Updates user account based on a token and their information (Response to initiate_user_invite) */
  acceptUserInvite: InviteUserResponse;
  createUserAccount: CreateUserAccountResponse;
  deleteUserAccount: DeleteUserAccountResponse;
  /**
   * Initiates the password reset flow for a user based on email address
   * The user will receive an email with a link to reset their password
   */
  initiatePasswordReset: PasswordResetResponse;
  /** Invites a new user to the system */
  initiateUserInvite: InviteUserResponse;
  requestChange: RequestChangeResponse;
  /** Resets the password for a user based on the password reset token */
  resetPasswordUsingToken: PasswordResetResponse;
  updateUserAccount: UpdateUserAccountResponse;
  upsertEntity: UpsertEntityResponse;
  /** Validates Password Reset Token */
  validatePasswordResetToken: PasswordResetResponse;
};


export type FullMutationAcceptUserInviteArgs = {
  input: AcceptUserInviteInput;
  token: Scalars['String']['input'];
};


export type FullMutationCreateUserAccountArgs = {
  input: CreateUserAccountInput;
};


export type FullMutationDeleteUserAccountArgs = {
  userAccountId: Scalars['String']['input'];
};


export type FullMutationInitiatePasswordResetArgs = {
  email: Scalars['String']['input'];
};


export type FullMutationInitiateUserInviteArgs = {
  input: InviteUserInput;
};


export type FullMutationRequestChangeArgs = {
  input: RequestChangeInput;
};


export type FullMutationResetPasswordUsingTokenArgs = {
  password: Scalars['String']['input'];
  token: Scalars['String']['input'];
};


export type FullMutationUpdateUserAccountArgs = {
  input: UpdateUserAccountInput;
};


export type FullMutationUpsertEntityArgs = {
  input: UpsertEntityInput;
};


export type FullMutationValidatePasswordResetTokenArgs = {
  token: Scalars['String']['input'];
};

export type FullQuery = {
  __typename: 'FullQuery';
  apiVersion: Scalars['String']['output'];
  /**
   * Retrieves a new auth bearer and refresh token
   * The refresh token is returned as a cookie
   */
  authToken: AuthTokenResponse;
  entities: EntityCollectionType;
  /** Query "universal codes" entry by code */
  entity?: Maybe<EntityType>;
  logout: LogoutResponse;
  logs: LogResponse;
  me: UserResponse;
  pendingChanges: PendingChangesResponse;
  /**
   * Retrieves a new auth bearer and refresh token
   * The refresh token is returned as a cookie
   */
  refreshToken: RefreshTokenResponse;
  /** Query "user_accounts" entries */
  userAccounts: UserAccountsResponse;
};


export type FullQueryAuthTokenArgs = {
  password: Scalars['String']['input'];
  username: Scalars['String']['input'];
};


export type FullQueryEntitiesArgs = {
  filter: EntitySearchInput;
  first?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type FullQueryEntityArgs = {
  code: Scalars['String']['input'];
};


export type FullQueryLogsArgs = {
  filter?: InputMaybe<LogFilterInput>;
  page?: InputMaybe<PaginationInput>;
  sort?: InputMaybe<Array<LogSortInput>>;
};


export type FullQueryPendingChangesArgs = {
  page?: InputMaybe<PaginationInput>;
};


export type FullQueryUserAccountsArgs = {
  filter?: InputMaybe<UserAccountFilterInput>;
  page?: InputMaybe<PaginationInput>;
  sort?: InputMaybe<Array<UserAccountSortInput>>;
};

export type InternalError = LogoutErrorInterface & RefreshTokenErrorInterface & {
  __typename: 'InternalError';
  description: Scalars['String']['output'];
  fullError: Scalars['String']['output'];
};

export type InvalidCredentials = AuthTokenErrorInterface & {
  __typename: 'InvalidCredentials';
  description: Scalars['String']['output'];
};

export type InvalidToken = RefreshTokenErrorInterface & {
  __typename: 'InvalidToken';
  description: Scalars['String']['output'];
};

export type InviteUserInput = {
  displayName: Scalars['String']['input'];
  email: Scalars['String']['input'];
  permissions: Array<PermissionNode>;
  username: Scalars['String']['input'];
};

export type InviteUserResponse = InviteUserResponseMessage;

export type InviteUserResponseMessage = {
  __typename: 'InviteUserResponseMessage';
  message: Scalars['String']['output'];
};

export type LogConnector = {
  __typename: 'LogConnector';
  nodes: Array<LogNode>;
  totalCount: Scalars['Int']['output'];
};

export type LogFilterInput = {
  id?: InputMaybe<EqualFilterStringInput>;
  recordId?: InputMaybe<EqualFilterStringInput>;
  recordType?: InputMaybe<EqualFilterLogTypeInput>;
  userId?: InputMaybe<EqualFilterStringInput>;
};

export type LogNode = {
  __typename: 'LogNode';
  datetime: Scalars['DateTime']['output'];
  id: Scalars['String']['output'];
  recordId?: Maybe<Scalars['String']['output']>;
  recordType: LogNodeType;
  user?: Maybe<UserAccountNode>;
};

export enum LogNodeType {
  UniversalCodeChangeRequested = 'UNIVERSAL_CODE_CHANGE_REQUESTED',
  UniversalCodeCreated = 'UNIVERSAL_CODE_CREATED',
  UniversalCodeUpdated = 'UNIVERSAL_CODE_UPDATED',
  UserAccountCreated = 'USER_ACCOUNT_CREATED',
  UserAccountPasswordResetInitiated = 'USER_ACCOUNT_PASSWORD_RESET_INITIATED',
  UserAccountUpdated = 'USER_ACCOUNT_UPDATED',
  UserLoggedIn = 'USER_LOGGED_IN'
}

export type LogResponse = LogConnector;

export enum LogSortFieldInput {
  Datetime = 'datetime',
  Id = 'id',
  LogType = 'logType',
  RecordId = 'recordId',
  UserId = 'userId'
}

export type LogSortInput = {
  /**
   * Sort query result is sorted descending or ascending (if not provided the default is
   * ascending)
   */
  desc?: InputMaybe<Scalars['Boolean']['input']>;
  /** Sort query result by `key` */
  key: LogSortFieldInput;
};

export type Logout = {
  __typename: 'Logout';
  /** User id of the logged out user */
  userId: Scalars['String']['output'];
};

export type LogoutError = {
  __typename: 'LogoutError';
  error: LogoutErrorInterface;
};

export type LogoutErrorInterface = {
  description: Scalars['String']['output'];
};

export type LogoutResponse = Logout | LogoutError;

export type NoRefreshTokenProvided = RefreshTokenErrorInterface & {
  __typename: 'NoRefreshTokenProvided';
  description: Scalars['String']['output'];
};

export type NotARefreshToken = RefreshTokenErrorInterface & {
  __typename: 'NotARefreshToken';
  description: Scalars['String']['output'];
};

/**
 * Pagination input.
 *
 * Option to limit the number of returned items and/or queries large lists in "pages".
 */
export type PaginationInput = {
  /** Max number of returned items */
  first?: InputMaybe<Scalars['Int']['input']>;
  /** First returned item is at the `offset` position in the full list */
  offset?: InputMaybe<Scalars['Int']['input']>;
};

export type PasswordResetResponse = PasswordResetResponseMessage;

export type PasswordResetResponseMessage = {
  __typename: 'PasswordResetResponseMessage';
  message: Scalars['String']['output'];
};

export type PendingChangeConnector = {
  __typename: 'PendingChangeConnector';
  nodes: Array<PendingChangeNode>;
  totalCount: Scalars['Int']['output'];
};

export type PendingChangeNode = {
  __typename: 'PendingChangeNode';
  body: Scalars['String']['output'];
  category: Scalars['String']['output'];
  changeType: ChangeTypeNode;
  dateRequested: Scalars['DateTime']['output'];
  name: Scalars['String']['output'];
  requestId: Scalars['String']['output'];
  requestedBy: Scalars['String']['output'];
  requestedFor: Scalars['String']['output'];
};

export type PendingChangesResponse = PendingChangeConnector;

export enum PermissionNode {
  Reader = 'READER',
  ServerAdmin = 'SERVER_ADMIN'
}

export type PropertiesType = {
  __typename: 'PropertiesType';
  code: Scalars['String']['output'];
  type: Scalars['String']['output'];
  value: Scalars['String']['output'];
};

export type PropertyInput = {
  code: Scalars['String']['input'];
  key: Scalars['String']['input'];
  value: Scalars['String']['input'];
};

export type RefreshToken = {
  __typename: 'RefreshToken';
  /** New Bearer token */
  token: Scalars['String']['output'];
};

export type RefreshTokenError = {
  __typename: 'RefreshTokenError';
  error: RefreshTokenErrorInterface;
};

export type RefreshTokenErrorInterface = {
  description: Scalars['String']['output'];
};

export type RefreshTokenResponse = RefreshToken | RefreshTokenError;

export type RequestChangeInput = {
  body: Scalars['String']['input'];
  category: Scalars['String']['input'];
  changeType: ChangeTypeNode;
  name: Scalars['String']['input'];
  requestId: Scalars['String']['input'];
  requestedFor: Scalars['String']['input'];
};

export type RequestChangeResponse = PendingChangeNode;

export type SimpleStringFilterInput = {
  /** Search term must be an exact match (case sensitive) */
  equalTo?: InputMaybe<Scalars['String']['input']>;
  /** Search term must be included in search candidate (case insensitive) */
  like?: InputMaybe<Scalars['String']['input']>;
};

export type TokenExpired = RefreshTokenErrorInterface & {
  __typename: 'TokenExpired';
  description: Scalars['String']['output'];
};

export type UpdateUserAccountInput = {
  displayName?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['String']['input'];
  password?: InputMaybe<Scalars['String']['input']>;
  permissions?: InputMaybe<Array<PermissionNode>>;
  username?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateUserAccountResponse = UserAccountNode;

export type UpsertEntityInput = {
  category?: InputMaybe<Scalars['String']['input']>;
  children?: InputMaybe<Array<UpsertEntityInput>>;
  code?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  parentCode?: InputMaybe<Scalars['String']['input']>;
  properties?: InputMaybe<Array<PropertyInput>>;
  type?: InputMaybe<Scalars['String']['input']>;
};

export type UpsertEntityResponse = EntityType;

export type UserAccountConnector = {
  __typename: 'UserAccountConnector';
  nodes: Array<UserAccountNode>;
  totalCount: Scalars['Int']['output'];
};

export type UserAccountFilterInput = {
  displayName?: InputMaybe<SimpleStringFilterInput>;
  id?: InputMaybe<EqualFilterStringInput>;
  search?: InputMaybe<Scalars['String']['input']>;
  username?: InputMaybe<SimpleStringFilterInput>;
};

export type UserAccountNode = {
  __typename: 'UserAccountNode';
  auditLogs: Array<LogNode>;
  displayName: Scalars['String']['output'];
  email?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  permissions: Array<PermissionNode>;
  username: Scalars['String']['output'];
};

export enum UserAccountSortFieldInput {
  DisplayName = 'displayName',
  Username = 'username'
}

export type UserAccountSortInput = {
  /**
   * Sort query result is sorted descending or ascending (if not provided the default is
   * ascending)
   */
  desc?: InputMaybe<Scalars['Boolean']['input']>;
  /** Sort query result by `key` */
  key: UserAccountSortFieldInput;
};

export type UserAccountsResponse = UserAccountConnector;

export type UserResponse = UserAccountNode;
