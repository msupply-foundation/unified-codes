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
  Upload: { input: any; output: any; }
};

export enum CacheControlScope {
  Private = 'PRIVATE',
  Public = 'PUBLIC'
}

export type DrugInteractionType = {
  __typename: 'DrugInteractionType';
  description: Scalars['String']['output'];
  name: Scalars['String']['output'];
  rxcui: Scalars['String']['output'];
  severity: Scalars['String']['output'];
  source: Scalars['String']['output'];
};

export type DrugInteractionsType = {
  __typename: 'DrugInteractionsType';
  data: Array<DrugInteractionType>;
  errors: Array<GraphQlErrorType>;
  rxcui: Scalars['String']['output'];
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
  type?: InputMaybe<Scalars['String']['input']>;
};

export type EntitySortInput = {
  /** Defaults to ascending search if not specified */
  descending?: InputMaybe<Scalars['Boolean']['input']>;
  /** Defaults to search on description if not specified */
  field?: InputMaybe<Scalars['String']['input']>;
};

export type EntityType = {
  __typename: 'EntityType';
  children?: Maybe<Array<EntityType>>;
  code: Scalars['String']['output'];
  description?: Maybe<Scalars['String']['output']>;
  interactions?: Maybe<Array<DrugInteractionType>>;
  parents?: Maybe<Array<EntityType>>;
  product?: Maybe<EntityType>;
  properties?: Maybe<Array<PropertyType>>;
  type: Scalars['String']['output'];
  uid: Scalars['ID']['output'];
};

export type ErrorType = {
  __typename: 'ErrorType';
  message: Scalars['String']['output'];
  name: Scalars['String']['output'];
  stack: Scalars['String']['output'];
};

export type GraphQlErrorType = {
  __typename: 'GraphQLErrorType';
  locations?: Maybe<Scalars['String']['output']>;
  message: Scalars['String']['output'];
  name?: Maybe<Scalars['String']['output']>;
  nodes?: Maybe<Scalars['String']['output']>;
  originalError?: Maybe<ErrorType>;
  path?: Maybe<Array<Scalars['String']['output']>>;
  positions?: Maybe<Array<Scalars['Int']['output']>>;
  source?: Maybe<SourceType>;
  stack?: Maybe<Scalars['String']['output']>;
};

export type LocationType = {
  __typename: 'LocationType';
  column: Scalars['Int']['output'];
  line: Scalars['Int']['output'];
};

export type PropertyType = {
  __typename: 'PropertyType';
  properties?: Maybe<Array<PropertyType>>;
  type: Scalars['String']['output'];
  value: Scalars['String']['output'];
};

export type Query = {
  __typename: 'Query';
  entities: EntityCollectionType;
  entity?: Maybe<EntityType>;
  entity2?: Maybe<EntityType>;
  interactions: DrugInteractionsType;
};


export type QueryEntitiesArgs = {
  filter: EntitySearchInput;
  first: Scalars['Int']['input'];
  offset: Scalars['Int']['input'];
};


export type QueryEntityArgs = {
  code: Scalars['String']['input'];
};


export type QueryEntity2Args = {
  code: Scalars['String']['input'];
};


export type QueryInteractionsArgs = {
  code: Scalars['String']['input'];
  severity?: InputMaybe<Scalars['String']['input']>;
};

export type SourceType = {
  __typename: 'SourceType';
  body: Scalars['String']['output'];
  locationOffset: LocationType;
  name: Scalars['String']['output'];
};
