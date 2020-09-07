export interface IPaginatable {
  cursor?: string;
}

export interface IPaginationParameters<T extends IPaginatable> {
  after: string;
  pageSize: number;
  results: Array<T>;
  getCursor?: (item: T) => null | Array<T>;
}

export interface IPaginatedResults<T extends IPaginatable> {
  entities: Array<T>;
  cursor?: string;
  hasMore: boolean;
  totalResults: number;
}
