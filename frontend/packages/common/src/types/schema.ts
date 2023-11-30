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

export type AddRecipientToListInput = {
  recipientId: Scalars['String']['input'];
  recipientListId: Scalars['String']['input'];
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

export enum ConfigKind {
  ColdChain = 'COLD_CHAIN',
  Scheduled = 'SCHEDULED'
}

export enum ConfigStatus {
  Disabled = 'DISABLED',
  Enabled = 'ENABLED'
}

export type CreateNotificationConfigInput = {
  id: Scalars['String']['input'];
  kind: ConfigKind;
  title: Scalars['String']['input'];
};

export type CreateNotificationQueryInput = {
  id: Scalars['String']['input'];
  name: Scalars['String']['input'];
  referenceName: Scalars['String']['input'];
};

export type CreateRecipientInput = {
  id: Scalars['String']['input'];
  name: Scalars['String']['input'];
  notificationType: NotificationTypeNode;
  toAddress: Scalars['String']['input'];
};

export type CreateRecipientListInput = {
  description: Scalars['String']['input'];
  id: Scalars['String']['input'];
  name: Scalars['String']['input'];
};

export type CreateRecipientResponse = RecipientNode;

export type CreateSqlRecipientListInput = {
  description: Scalars['String']['input'];
  id: Scalars['String']['input'];
  name: Scalars['String']['input'];
  parameters: Array<Scalars['String']['input']>;
  query: Scalars['String']['input'];
};

export type CreateUserAccountInput = {
  displayName?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['String']['input'];
  password: Scalars['String']['input'];
  permissions: Array<PermissionNode>;
  username: Scalars['String']['input'];
};

export type CreateUserAccountResponse = UserAccountNode;

export type DatabaseError = NodeErrorInterface & RefreshTokenErrorInterface & {
  __typename: 'DatabaseError';
  description: Scalars['String']['output'];
  fullError: Scalars['String']['output'];
};

export type DatetimeFilterInput = {
  afterOrEqualTo?: InputMaybe<Scalars['DateTime']['input']>;
  beforeOrEqualTo?: InputMaybe<Scalars['DateTime']['input']>;
  equalTo?: InputMaybe<Scalars['DateTime']['input']>;
};

export type DeleteNotificationConfigResponse = DeleteResponse;

export type DeleteNotificationQueryResponse = DeleteResponse;

export type DeleteRecipientListResponse = DeleteResponse;

export type DeleteRecipientResponse = DeleteResponse;

export type DeleteResponse = {
  __typename: 'DeleteResponse';
  id: Scalars['String']['output'];
};

export type DeleteSqlRecipientListResponse = DeleteResponse;

export type DeleteUserAccountResponse = DeleteResponse;

export type DuplicateNotificationConfigInput = {
  newId: Scalars['String']['input'];
  oldId: Scalars['String']['input'];
};

export type EqualFilterConfigKindInput = {
  equalAny?: InputMaybe<Array<ConfigKind>>;
  equalTo?: InputMaybe<ConfigKind>;
  notEqualTo?: InputMaybe<ConfigKind>;
};

export type EqualFilterConfigStatusInput = {
  equalAny?: InputMaybe<Array<ConfigStatus>>;
  equalTo?: InputMaybe<ConfigStatus>;
  notEqualTo?: InputMaybe<ConfigStatus>;
};

export type EqualFilterEventStatusInput = {
  equalAny?: InputMaybe<Array<EventStatus>>;
  equalTo?: InputMaybe<EventStatus>;
  notEqualTo?: InputMaybe<EventStatus>;
};

export type EqualFilterLogTypeInput = {
  equalAny?: InputMaybe<Array<LogNodeType>>;
  equalTo?: InputMaybe<LogNodeType>;
  notEqualTo?: InputMaybe<LogNodeType>;
};

export type EqualFilterNotificationTypeInput = {
  equalAny?: InputMaybe<Array<NotificationTypeNode>>;
  equalTo?: InputMaybe<NotificationTypeNode>;
  notEqualTo?: InputMaybe<NotificationTypeNode>;
};

export type EqualFilterStringInput = {
  equalAny?: InputMaybe<Array<Scalars['String']['input']>>;
  equalTo?: InputMaybe<Scalars['String']['input']>;
  notEqualTo?: InputMaybe<Scalars['String']['input']>;
};

export enum EventStatus {
  Errored = 'ERRORED',
  Failed = 'FAILED',
  Queued = 'QUEUED',
  Sent = 'SENT'
}

export type FullMutation = {
  __typename: 'FullMutation';
  /** Updates user account based on a token and their information (Response to initiate_user_invite) */
  acceptUserInvite: InviteUserResponse;
  addRecipientToList: ModifyRecipientListMembersResponse;
  createNotificationConfig: ModifyNotificationConfigResponse;
  createNotificationQuery: ModifyNotificationQueryResponse;
  createRecipient: CreateRecipientResponse;
  createRecipientList: ModifyRecipientListResponse;
  createSqlRecipientList: ModifySqlRecipientListResponse;
  createUserAccount: CreateUserAccountResponse;
  deleteNotificationConfig: DeleteNotificationConfigResponse;
  deleteNotificationQuery: DeleteNotificationQueryResponse;
  deleteRecipient: DeleteRecipientResponse;
  deleteRecipientList: DeleteRecipientListResponse;
  deleteSqlRecipientList: DeleteSqlRecipientListResponse;
  deleteUserAccount: DeleteUserAccountResponse;
  duplicateNotificationConfig: ModifyNotificationConfigResponse;
  /**
   * Initiates the password reset flow for a user based on email address
   * The user will receive an email with a link to reset their password
   */
  initiatePasswordReset: PasswordResetResponse;
  /** Invites a new user to the system */
  initiateUserInvite: InviteUserResponse;
  removeRecipientFromList: ModifyRecipientListMembersResponse;
  /** Resets the password for a user based on the password reset token */
  resetPasswordUsingToken: PasswordResetResponse;
  sendTestTelegramMessage: TelegramMessageResponse;
  updateNotificationConfig: ModifyNotificationConfigResponse;
  updateNotificationQuery: ModifyNotificationQueryResponse;
  updateRecipient: UpdateRecipientResponse;
  updateRecipientList: ModifyRecipientListResponse;
  updateSqlRecipientList: ModifySqlRecipientListResponse;
  updateUserAccount: UpdateUserAccountResponse;
  /** Validates Password Reset Token */
  validatePasswordResetToken: PasswordResetResponse;
};


export type FullMutationAcceptUserInviteArgs = {
  input: AcceptUserInviteInput;
  token: Scalars['String']['input'];
};


export type FullMutationAddRecipientToListArgs = {
  input: AddRecipientToListInput;
};


export type FullMutationCreateNotificationConfigArgs = {
  input: CreateNotificationConfigInput;
};


export type FullMutationCreateNotificationQueryArgs = {
  input: CreateNotificationQueryInput;
};


export type FullMutationCreateRecipientArgs = {
  input: CreateRecipientInput;
};


export type FullMutationCreateRecipientListArgs = {
  input: CreateRecipientListInput;
};


export type FullMutationCreateSqlRecipientListArgs = {
  input: CreateSqlRecipientListInput;
};


export type FullMutationCreateUserAccountArgs = {
  input: CreateUserAccountInput;
};


export type FullMutationDeleteNotificationConfigArgs = {
  id: Scalars['String']['input'];
};


export type FullMutationDeleteNotificationQueryArgs = {
  id: Scalars['String']['input'];
};


export type FullMutationDeleteRecipientArgs = {
  recipientId: Scalars['String']['input'];
};


export type FullMutationDeleteRecipientListArgs = {
  recipientListId: Scalars['String']['input'];
};


export type FullMutationDeleteSqlRecipientListArgs = {
  sqlRecipientListId: Scalars['String']['input'];
};


export type FullMutationDeleteUserAccountArgs = {
  userAccountId: Scalars['String']['input'];
};


export type FullMutationDuplicateNotificationConfigArgs = {
  input: DuplicateNotificationConfigInput;
};


export type FullMutationInitiatePasswordResetArgs = {
  email: Scalars['String']['input'];
};


export type FullMutationInitiateUserInviteArgs = {
  input: InviteUserInput;
};


export type FullMutationRemoveRecipientFromListArgs = {
  input: RemoveRecipientFromListInput;
};


export type FullMutationResetPasswordUsingTokenArgs = {
  password: Scalars['String']['input'];
  token: Scalars['String']['input'];
};


export type FullMutationSendTestTelegramMessageArgs = {
  chatId: Scalars['String']['input'];
};


export type FullMutationUpdateNotificationConfigArgs = {
  input: UpdateNotificationConfigInput;
};


export type FullMutationUpdateNotificationQueryArgs = {
  input: UpdateNotificationQueryInput;
};


export type FullMutationUpdateRecipientArgs = {
  input: UpdateRecipientInput;
};


export type FullMutationUpdateRecipientListArgs = {
  input: UpdateRecipientListInput;
};


export type FullMutationUpdateSqlRecipientListArgs = {
  input: UpdateSqlRecipientListInput;
};


export type FullMutationUpdateUserAccountArgs = {
  input: UpdateUserAccountInput;
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
  logout: LogoutResponse;
  logs: LogResponse;
  me: UserResponse;
  notificationConfigs: NotificationConfigsResponse;
  notificationEvents: NotificationEventsResponse;
  notificationQueries: NotificationQueriesResponse;
  /** Query "recipient_list" entries */
  recipientLists: RecipientListsResponse;
  /** Query "recipient" entries */
  recipients: RecipientsResponse;
  /**
   * Retrieves a new auth bearer and refresh token
   * The refresh token is returned as a cookie
   */
  refreshToken: RefreshTokenResponse;
  runSqlQuery: QueryResultResponse;
  runSqlQueryWithParameters: QueryResultResponse;
  /** Query "sql_recipient_list" entries */
  sqlRecipientLists: SqlRecipientListsResponse;
  telegramBotName: Scalars['String']['output'];
  testSqlRecipientListQuery: RecipientsResponse;
  /** Query "user_accounts" entries */
  userAccounts: UserAccountsResponse;
};


export type FullQueryAuthTokenArgs = {
  password: Scalars['String']['input'];
  username: Scalars['String']['input'];
};


export type FullQueryLogsArgs = {
  filter?: InputMaybe<LogFilterInput>;
  page?: InputMaybe<PaginationInput>;
  sort?: InputMaybe<Array<LogSortInput>>;
};


export type FullQueryNotificationConfigsArgs = {
  filter?: InputMaybe<NotificationConfigFilterInput>;
  page?: InputMaybe<PaginationInput>;
  sort?: InputMaybe<Array<NotificationConfigSortInput>>;
};


export type FullQueryNotificationEventsArgs = {
  filter?: InputMaybe<NotificationEventFilterInput>;
  page?: InputMaybe<PaginationInput>;
  sort?: InputMaybe<Array<NotificationEventSortInput>>;
};


export type FullQueryNotificationQueriesArgs = {
  filter?: InputMaybe<NotificationQueryFilterInput>;
  page?: InputMaybe<PaginationInput>;
  sort?: InputMaybe<Array<NotificationQuerySortInput>>;
};


export type FullQueryRecipientListsArgs = {
  filter?: InputMaybe<RecipientListFilterInput>;
  page?: InputMaybe<PaginationInput>;
  sort?: InputMaybe<Array<RecipientListSortInput>>;
};


export type FullQueryRecipientsArgs = {
  filter?: InputMaybe<RecipientFilterInput>;
  page?: InputMaybe<PaginationInput>;
  sort?: InputMaybe<Array<RecipientSortInput>>;
};


export type FullQueryRunSqlQueryArgs = {
  sqlQuery: Scalars['String']['input'];
};


export type FullQueryRunSqlQueryWithParametersArgs = {
  parameters: Scalars['String']['input'];
  sqlQuery: Scalars['String']['input'];
};


export type FullQuerySqlRecipientListsArgs = {
  filter?: InputMaybe<RecipientListFilterInput>;
  page?: InputMaybe<PaginationInput>;
  sort?: InputMaybe<Array<RecipientListSortInput>>;
};


export type FullQueryTestSqlRecipientListQueryArgs = {
  params: Scalars['String']['input'];
  query: Scalars['String']['input'];
};


export type FullQueryUserAccountsArgs = {
  filter?: InputMaybe<UserAccountFilterInput>;
  page?: InputMaybe<PaginationInput>;
  sort?: InputMaybe<Array<UserAccountSortInput>>;
};

export type IdResponse = {
  __typename: 'IdResponse';
  id: Scalars['String']['output'];
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
  NotificationConfigCreated = 'NOTIFICATION_CONFIG_CREATED',
  NotificationConfigUpdated = 'NOTIFICATION_CONFIG_UPDATED',
  NotificationQueryCreated = 'NOTIFICATION_QUERY_CREATED',
  NotificationQueryUpdated = 'NOTIFICATION_QUERY_UPDATED',
  RecipientAddedToList = 'RECIPIENT_ADDED_TO_LIST',
  RecipientCreated = 'RECIPIENT_CREATED',
  RecipientListCreated = 'RECIPIENT_LIST_CREATED',
  RecipientListUpdated = 'RECIPIENT_LIST_UPDATED',
  RecipientRemovedFromList = 'RECIPIENT_REMOVED_FROM_LIST',
  RecipientUpdated = 'RECIPIENT_UPDATED',
  SqlRecipientListCreated = 'SQL_RECIPIENT_LIST_CREATED',
  SqlRecipientListUpdated = 'SQL_RECIPIENT_LIST_UPDATED',
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

export type ModifyNotificationConfigResponse = NotificationConfigNode;

export type ModifyNotificationQueryResponse = NotificationQueryNode;

export type ModifyRecipientListMembersResponse = IdResponse;

export type ModifyRecipientListResponse = RecipientListNode;

export type ModifySqlRecipientListResponse = SqlRecipientListNode;

export type NoRefreshTokenProvided = RefreshTokenErrorInterface & {
  __typename: 'NoRefreshTokenProvided';
  description: Scalars['String']['output'];
};

/** Generic Error Wrapper */
export type NodeError = {
  __typename: 'NodeError';
  error: NodeErrorInterface;
};

export type NodeErrorInterface = {
  description: Scalars['String']['output'];
};

export type NotARefreshToken = RefreshTokenErrorInterface & {
  __typename: 'NotARefreshToken';
  description: Scalars['String']['output'];
};

export type NotificationConfigConnector = {
  __typename: 'NotificationConfigConnector';
  nodes: Array<NotificationConfigNode>;
  totalCount: Scalars['Int']['output'];
};

export type NotificationConfigFilterInput = {
  id?: InputMaybe<EqualFilterStringInput>;
  kind?: InputMaybe<EqualFilterConfigKindInput>;
  search?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<EqualFilterConfigStatusInput>;
  title?: InputMaybe<StringFilterInput>;
};

export type NotificationConfigNode = {
  __typename: 'NotificationConfigNode';
  auditLogs: Array<LogNode>;
  configurationData: Scalars['String']['output'];
  id: Scalars['String']['output'];
  kind: ConfigKind;
  parameters: Scalars['String']['output'];
  recipientIds: Array<Scalars['String']['output']>;
  recipientListIds: Array<Scalars['String']['output']>;
  sqlRecipientListIds: Array<Scalars['String']['output']>;
  status: ConfigStatus;
  title: Scalars['String']['output'];
};

export enum NotificationConfigSortFieldInput {
  Kind = 'kind',
  Status = 'status',
  Title = 'title'
}

export type NotificationConfigSortInput = {
  /**
   * Sort query result is sorted descending or ascending (if not provided the default is
   * ascending)
   */
  desc?: InputMaybe<Scalars['Boolean']['input']>;
  /** Sort query result by `key` */
  key: NotificationConfigSortFieldInput;
};

export type NotificationConfigsResponse = NotificationConfigConnector;

export type NotificationEventConnector = {
  __typename: 'NotificationEventConnector';
  nodes: Array<NotificationEventNode>;
  totalCount: Scalars['Int']['output'];
};

export type NotificationEventFilterInput = {
  createdAt?: InputMaybe<DatetimeFilterInput>;
  id?: InputMaybe<EqualFilterStringInput>;
  notificationConfigId?: InputMaybe<EqualFilterStringInput>;
  search?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<EqualFilterEventStatusInput>;
};

export type NotificationEventNode = {
  __typename: 'NotificationEventNode';
  context?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  errorMessage?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  message: Scalars['String']['output'];
  notificationConfig?: Maybe<NotificationConfigNode>;
  notificationConfigId?: Maybe<Scalars['String']['output']>;
  notificationType: NotificationTypeNode;
  sendAttempts: Scalars['Int']['output'];
  sentAt?: Maybe<Scalars['DateTime']['output']>;
  status: EventStatus;
  title: Scalars['String']['output'];
  toAddress: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export enum NotificationEventSortFieldInput {
  CreatedAt = 'createdAt',
  ErrorMessage = 'errorMessage',
  Message = 'message',
  NotificationType = 'notificationType',
  Status = 'status',
  Title = 'title',
  ToAddress = 'toAddress'
}

export type NotificationEventSortInput = {
  /**
   * Sort query result is sorted descending or ascending (if not provided the default is
   * ascending)
   */
  desc?: InputMaybe<Scalars['Boolean']['input']>;
  /** Sort query result by `key` */
  key: NotificationEventSortFieldInput;
};

export type NotificationEventsResponse = NotificationEventConnector;

export type NotificationQueriesResponse = NotificationQueryConnector;

export type NotificationQueryConnector = {
  __typename: 'NotificationQueryConnector';
  nodes: Array<NotificationQueryNode>;
  totalCount: Scalars['Int']['output'];
};

export type NotificationQueryFilterInput = {
  id?: InputMaybe<EqualFilterStringInput>;
  name?: InputMaybe<StringFilterInput>;
  search?: InputMaybe<Scalars['String']['input']>;
};

export type NotificationQueryNode = {
  __typename: 'NotificationQueryNode';
  description: Scalars['String']['output'];
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  query: Scalars['String']['output'];
  referenceName: Scalars['String']['output'];
  requiredParameters: Array<Scalars['String']['output']>;
};

export enum NotificationQuerySortFieldInput {
  Name = 'name'
}

export type NotificationQuerySortInput = {
  /**
   * Sort query result is sorted descending or ascending (if not provided the default is
   * ascending)
   */
  desc?: InputMaybe<Scalars['Boolean']['input']>;
  /** Sort query result by `key` */
  key: NotificationQuerySortFieldInput;
};

export enum NotificationTypeNode {
  Email = 'EMAIL',
  Telegram = 'TELEGRAM',
  Unknown = 'UNKNOWN'
}

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

export enum PermissionNode {
  Reader = 'READER',
  ServerAdmin = 'SERVER_ADMIN'
}

export type QueryResultNode = {
  __typename: 'QueryResultNode';
  query: Scalars['String']['output'];
  queryError?: Maybe<Scalars['String']['output']>;
  results: Scalars['String']['output'];
};

export type QueryResultResponse = NodeError | QueryResultNode;

export type RecipientConnector = {
  __typename: 'RecipientConnector';
  nodes: Array<RecipientNode>;
  totalCount: Scalars['Int']['output'];
};

export type RecipientFilterInput = {
  id?: InputMaybe<EqualFilterStringInput>;
  notificationType?: InputMaybe<EqualFilterNotificationTypeInput>;
  search?: InputMaybe<Scalars['String']['input']>;
  toAddress?: InputMaybe<StringFilterInput>;
};

export type RecipientListConnector = {
  __typename: 'RecipientListConnector';
  nodes: Array<RecipientListNode>;
  totalCount: Scalars['Int']['output'];
};

export type RecipientListFilterInput = {
  id?: InputMaybe<EqualFilterStringInput>;
  name?: InputMaybe<StringFilterInput>;
  search?: InputMaybe<Scalars['String']['input']>;
};

export type RecipientListNode = {
  __typename: 'RecipientListNode';
  auditLogs: Array<LogNode>;
  description: Scalars['String']['output'];
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  recipients: Array<RecipientNode>;
};

export enum RecipientListSortFieldInput {
  Name = 'name'
}

export type RecipientListSortInput = {
  /**
   * Sort query result is sorted descending or ascending (if not provided the default is
   * ascending)
   */
  desc?: InputMaybe<Scalars['Boolean']['input']>;
  /** Sort query result by `key` */
  key: RecipientListSortFieldInput;
};

export type RecipientListsResponse = RecipientListConnector;

export type RecipientNode = {
  __typename: 'RecipientNode';
  auditLogs: Array<LogNode>;
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  notificationType: NotificationTypeNode;
  toAddress: Scalars['String']['output'];
};

export enum RecipientSortFieldInput {
  Name = 'name',
  ToAddress = 'toAddress'
}

export type RecipientSortInput = {
  /**
   * Sort query result is sorted descending or ascending (if not provided the default is
   * ascending)
   */
  desc?: InputMaybe<Scalars['Boolean']['input']>;
  /** Sort query result by `key` */
  key: RecipientSortFieldInput;
};

export type RecipientsResponse = RecipientConnector;

export type RecordNotFound = NodeErrorInterface & {
  __typename: 'RecordNotFound';
  description: Scalars['String']['output'];
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

export type RemoveRecipientFromListInput = {
  recipientId: Scalars['String']['input'];
  recipientListId: Scalars['String']['input'];
};

export type SimpleStringFilterInput = {
  /** Search term must be an exact match (case sensitive) */
  equalTo?: InputMaybe<Scalars['String']['input']>;
  /** Search term must be included in search candidate (case insensitive) */
  like?: InputMaybe<Scalars['String']['input']>;
};

export type SqlRecipientListConnector = {
  __typename: 'SqlRecipientListConnector';
  nodes: Array<SqlRecipientListNode>;
  totalCount: Scalars['Int']['output'];
};

export type SqlRecipientListNode = {
  __typename: 'SqlRecipientListNode';
  auditLogs: Array<LogNode>;
  description: Scalars['String']['output'];
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  parameters: Array<Scalars['String']['output']>;
  query: Scalars['String']['output'];
};

export type SqlRecipientListsResponse = SqlRecipientListConnector;

export type StringFilterInput = {
  endsWith?: InputMaybe<Scalars['String']['input']>;
  equalAny?: InputMaybe<Array<Scalars['String']['input']>>;
  /** Search term must be an exact match (case sensitive) */
  equalTo?: InputMaybe<Scalars['String']['input']>;
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  /** Search term must be included in search candidate (case insensitive) */
  like?: InputMaybe<Scalars['String']['input']>;
  notEqualAll?: InputMaybe<Array<Scalars['String']['input']>>;
  notEqualTo?: InputMaybe<Scalars['String']['input']>;
  startsWith?: InputMaybe<Scalars['String']['input']>;
};

export type TelegramMessageNode = {
  __typename: 'TelegramMessageNode';
  chatId: Scalars['String']['output'];
  chatName: Scalars['String']['output'];
  message: Scalars['String']['output'];
  username: Scalars['String']['output'];
};

export type TelegramMessageResponse = TelegramMessageNode;

export type TokenExpired = RefreshTokenErrorInterface & {
  __typename: 'TokenExpired';
  description: Scalars['String']['output'];
};

export type UpdateNotificationConfigInput = {
  configurationData?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['String']['input'];
  nextDueDatetime?: InputMaybe<Scalars['DateTime']['input']>;
  parameters?: InputMaybe<Scalars['String']['input']>;
  recipientIds?: InputMaybe<Array<Scalars['String']['input']>>;
  recipientListIds?: InputMaybe<Array<Scalars['String']['input']>>;
  sqlRecipientListIds?: InputMaybe<Array<Scalars['String']['input']>>;
  status?: InputMaybe<ConfigStatus>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateNotificationQueryInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['String']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  query?: InputMaybe<Scalars['String']['input']>;
  referenceName?: InputMaybe<Scalars['String']['input']>;
  requiredParameters?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type UpdateRecipientInput = {
  id: Scalars['String']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  toAddress?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateRecipientListInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['String']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateRecipientResponse = RecipientNode;

export type UpdateSqlRecipientListInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['String']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  parameters?: InputMaybe<Array<Scalars['String']['input']>>;
  query?: InputMaybe<Scalars['String']['input']>;
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
