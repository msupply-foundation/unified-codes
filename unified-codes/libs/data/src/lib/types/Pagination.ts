export interface IPaginationParameters<T> {
  offset: number;
  first: number;
  results: Array<T>;
}

export interface IPaginatedResults<T> {
  entities: Array<T>;
  hasMore: boolean;
  totalResults: number;
}

export interface IPaginationRequest {
  first?: number;
  offset?: number;
}
