export interface IPaginationParameters<T> {
  offset: number;
  first: number;
  results: Array<T>;
}

export interface IPaginatedResults<T> {
  data: Array<T>;
  hasMore: boolean;
  totalResults: number;
}
