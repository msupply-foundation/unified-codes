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

export type AddBarcodeInput = {
  entityCode: Scalars['String']['input'];
  gtin: Scalars['String']['input'];
  manufacturer: Scalars['String']['input'];
};

export type AddConfigurationItemInput = {
  name: Scalars['String']['input'];
  type: ConfigurationItemTypeInput;
};

export type AlternativeNameInput = {
  code: Scalars['String']['input'];
  name: Scalars['String']['input'];
};

export type AlternativeNameType = {
  __typename: 'AlternativeNameType';
  code: Scalars['String']['output'];
  name: Scalars['String']['output'];
  type: Scalars['String']['output'];
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

export type BarcodeCollectionConnector = {
  __typename: 'BarcodeCollectionConnector';
  data: Array<BarcodeNode>;
  totalCount: Scalars['Int']['output'];
};

export type BarcodeCollectionResponse = BarcodeCollectionConnector;

export type BarcodeNode = {
  __typename: 'BarcodeNode';
  entity: EntityType;
  gtin: Scalars['String']['output'];
  id: Scalars['String']['output'];
  manufacturer: Scalars['String']['output'];
};

export type BarcodeResponse = BarcodeNode;

export type BarcodeType = {
  __typename: 'BarcodeType';
  gtin: Scalars['String']['output'];
  id: Scalars['String']['output'];
  manufacturer: Scalars['String']['output'];
};

export enum ChangeStatusNode {
  Approved = 'APPROVED',
  Pending = 'PENDING',
  Rejected = 'REJECTED'
}

export enum ChangeTypeNode {
  Change = 'CHANGE',
  New = 'NEW'
}

export type ConfigurationItemConnector = {
  __typename: 'ConfigurationItemConnector';
  data: Array<ConfigurationItemNode>;
  totalCount: Scalars['Int']['output'];
};

export type ConfigurationItemNode = {
  __typename: 'ConfigurationItemNode';
  code: Scalars['String']['output'];
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  type: Scalars['String']['output'];
};

export enum ConfigurationItemTypeInput {
  Form = 'form',
  ImmediatePackaging = 'immediate_packaging',
  Route = 'route'
}

export type ConfigurationItemsResponse = ConfigurationItemConnector;

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

export type DrugInteractionConnector = {
  __typename: 'DrugInteractionConnector';
  data: Array<DrugInteractionNode>;
  totalCount: Scalars['Int']['output'];
};

export type DrugInteractionGroupConnector = {
  __typename: 'DrugInteractionGroupConnector';
  data: Array<DrugInteractionGroupNode>;
  totalCount: Scalars['Int']['output'];
};

export type DrugInteractionGroupNode = {
  __typename: 'DrugInteractionGroupNode';
  description?: Maybe<Scalars['String']['output']>;
  drugs: Array<EntityType>;
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
};

export type DrugInteractionGroupsResponse = DrugInteractionGroupConnector;

export type DrugInteractionNode = {
  __typename: 'DrugInteractionNode';
  action?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  drug1?: Maybe<EntityType>;
  drug2?: Maybe<EntityType>;
  group1?: Maybe<DrugInteractionGroupNode>;
  group2?: Maybe<DrugInteractionGroupNode>;
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  reference?: Maybe<Scalars['String']['output']>;
  severity: DrugInteractionSeverityNode;
};

export enum DrugInteractionSeverityNode {
  Moderate = 'MODERATE',
  NothingExpected = 'NOTHING_EXPECTED',
  Severe = 'SEVERE',
  Unknown = 'UNKNOWN'
}

export type DrugInteractionType = {
  __typename: 'DrugInteractionType';
  description: Scalars['String']['output'];
  name: Scalars['String']['output'];
  rxcui: Scalars['String']['output'];
  severity: Scalars['String']['output'];
  source: Scalars['String']['output'];
};

export type DrugInteractionsResponse = DrugInteractionConnector;

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
  alternativeNames: Array<AlternativeNameType>;
  barcodes: Array<BarcodeType>;
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
  addBarcode: BarcodeResponse;
  addConfigurationItem: Scalars['Int']['output'];
  approvePendingChange: UpsertEntityResponse;
  createUserAccount: CreateUserAccountResponse;
  deleteBarcode: Scalars['Int']['output'];
  deleteConfigurationItem: Scalars['Int']['output'];
  deleteDrugInteraction: Scalars['Int']['output'];
  deleteDrugInteractionGroup: Scalars['Int']['output'];
  deleteUserAccount: DeleteUserAccountResponse;
  /**
   * Initiates the password reset flow for a user based on email address
   * The user will receive an email with a link to reset their password
   */
  initiatePasswordReset: PasswordResetResponse;
  /** Invites a new user to the system */
  initiateUserInvite: InviteUserResponse;
  rejectPendingChange: IdResponse;
  requestChange: RequestChangeResponse;
  /** Resets the password for a user based on the password reset token */
  resetPasswordUsingToken: PasswordResetResponse;
  updatePendingChange: RequestChangeResponse;
  updateUserAccount: UpdateUserAccountResponse;
  upsertDrugInteraction: Scalars['Int']['output'];
  upsertDrugInteractionGroup: Scalars['Int']['output'];
  upsertPropertyConfigurationItem: Scalars['Int']['output'];
  /** Validates Password Reset Token */
  validatePasswordResetToken: PasswordResetResponse;
};


export type FullMutationAcceptUserInviteArgs = {
  input: AcceptUserInviteInput;
  token: Scalars['String']['input'];
};


export type FullMutationAddBarcodeArgs = {
  input: AddBarcodeInput;
};


export type FullMutationAddConfigurationItemArgs = {
  input: AddConfigurationItemInput;
};


export type FullMutationApprovePendingChangeArgs = {
  input: UpsertEntityInput;
  requestId: Scalars['String']['input'];
};


export type FullMutationCreateUserAccountArgs = {
  input: CreateUserAccountInput;
};


export type FullMutationDeleteBarcodeArgs = {
  gtin: Scalars['String']['input'];
};


export type FullMutationDeleteConfigurationItemArgs = {
  code: Scalars['String']['input'];
};


export type FullMutationDeleteDrugInteractionArgs = {
  code: Scalars['String']['input'];
};


export type FullMutationDeleteDrugInteractionGroupArgs = {
  code: Scalars['String']['input'];
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


export type FullMutationRejectPendingChangeArgs = {
  requestId: Scalars['String']['input'];
};


export type FullMutationRequestChangeArgs = {
  input: RequestChangeInput;
};


export type FullMutationResetPasswordUsingTokenArgs = {
  password: Scalars['String']['input'];
  token: Scalars['String']['input'];
};


export type FullMutationUpdatePendingChangeArgs = {
  body: Scalars['String']['input'];
  requestId: Scalars['String']['input'];
};


export type FullMutationUpdateUserAccountArgs = {
  input: UpdateUserAccountInput;
};


export type FullMutationUpsertDrugInteractionArgs = {
  input: UpsertDrugInteractionInput;
};


export type FullMutationUpsertDrugInteractionGroupArgs = {
  input: UpsertDrugInteractionGroupInput;
};


export type FullMutationUpsertPropertyConfigurationItemArgs = {
  input: UpsertPropertyConfigItemInput;
};


export type FullMutationValidatePasswordResetTokenArgs = {
  token: Scalars['String']['input'];
};

export type FullQuery = {
  __typename: 'FullQuery';
  /** Get all the drug interaction groups, no pagination as we assume it won't get too big... */
  allDrugInteractionGroups: DrugInteractionGroupsResponse;
  /** Get all the drug interactions, no pagination as we assume it won't get too big... */
  allDrugInteractions: DrugInteractionsResponse;
  apiVersion: Scalars['String']['output'];
  /**
   * Retrieves a new auth bearer and refresh token
   * The refresh token is returned as a cookie
   */
  authToken: AuthTokenResponse;
  /** Get all barcodes */
  barcodes: BarcodeCollectionResponse;
  /** Get the configuration items for a given type. */
  configurationItems: ConfigurationItemsResponse;
  entities: EntityCollectionType;
  /** Query "universal codes" entry by code */
  entity?: Maybe<EntityType>;
  logout: LogoutResponse;
  logs: LogResponse;
  me: UserResponse;
  pendingChange?: Maybe<PendingChangeNode>;
  pendingChanges: PendingChangesResponse;
  product?: Maybe<EntityType>;
  /** Get the property configuration items */
  propertyConfigurationItems: PropertyConfigurationItemsResponse;
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


export type FullQueryBarcodesArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type FullQueryConfigurationItemsArgs = {
  type: ConfigurationItemTypeInput;
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


export type FullQueryPendingChangeArgs = {
  requestId: Scalars['String']['input'];
};


export type FullQueryPendingChangesArgs = {
  page?: InputMaybe<PaginationInput>;
  sort?: InputMaybe<Array<PendingChangeSortInput>>;
};


export type FullQueryProductArgs = {
  code: Scalars['String']['input'];
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
  BarcodeCreated = 'BARCODE_CREATED',
  BarcodeDeleted = 'BARCODE_DELETED',
  ConfigurationItemCreated = 'CONFIGURATION_ITEM_CREATED',
  ConfigurationItemDeleted = 'CONFIGURATION_ITEM_DELETED',
  DrugInteractionDeleted = 'DRUG_INTERACTION_DELETED',
  DrugInteractionGroupDeleted = 'DRUG_INTERACTION_GROUP_DELETED',
  DrugInteractionGroupUpserted = 'DRUG_INTERACTION_GROUP_UPSERTED',
  DrugInteractionUpserted = 'DRUG_INTERACTION_UPSERTED',
  PropertyConfigurationItemUpserted = 'PROPERTY_CONFIGURATION_ITEM_UPSERTED',
  UniversalCodeChangeApproved = 'UNIVERSAL_CODE_CHANGE_APPROVED',
  UniversalCodeChangeRejected = 'UNIVERSAL_CODE_CHANGE_REJECTED',
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
  status: ChangeStatusNode;
};

export enum PendingChangeSortFieldInput {
  Category = 'category',
  DateRequested = 'dateRequested',
  Name = 'name'
}

export type PendingChangeSortInput = {
  /**
   * Sort query result is sorted descending or ascending (if not provided the default is
   * ascending)
   */
  desc?: InputMaybe<Scalars['Boolean']['input']>;
  /** Sort query result by `key` */
  key: PendingChangeSortFieldInput;
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

export type PropertyConfigurationItemConnector = {
  __typename: 'PropertyConfigurationItemConnector';
  data: Array<PropertyConfigurationItemNode>;
  totalCount: Scalars['Int']['output'];
};

export type PropertyConfigurationItemNode = {
  __typename: 'PropertyConfigurationItemNode';
  id: Scalars['String']['output'];
  label: Scalars['String']['output'];
  type: Scalars['String']['output'];
  url: Scalars['String']['output'];
};

export type PropertyConfigurationItemsResponse = PropertyConfigurationItemConnector;

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

export type UpsertDrugInteractionGroupInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  drugs: Array<Scalars['String']['input']>;
  id: Scalars['String']['input'];
  name: Scalars['String']['input'];
};

export type UpsertDrugInteractionInput = {
  action: Scalars['String']['input'];
  description: Scalars['String']['input'];
  drug1?: InputMaybe<Scalars['String']['input']>;
  drug2?: InputMaybe<Scalars['String']['input']>;
  group1?: InputMaybe<Scalars['String']['input']>;
  group2?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['String']['input'];
  name: Scalars['String']['input'];
  reference: Scalars['String']['input'];
  severity: DrugInteractionSeverityNode;
};

export type UpsertEntityInput = {
  alternativeNames?: InputMaybe<Array<AlternativeNameInput>>;
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

export type UpsertPropertyConfigItemInput = {
  label: Scalars['String']['input'];
  type: Scalars['String']['input'];
  url: Scalars['String']['input'];
};

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
