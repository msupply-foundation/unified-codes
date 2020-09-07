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
  first: number;
  offset: number;
}
export class PaginationRequest implements IPaginationRequest {
  _first: number;
  _offset: number;

  constructor(first?: number, offset?: number) {
    this._first = first || 25;
    this._offset = offset || 0;
  }

  get first(): number {
    return this._first;
  }

  get offset(): number {
    return this._offset;
  }
}
