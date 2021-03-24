import { IEntity } from './Entity';

export interface IEntityResultSet {
  results: IEntity[];
  size: number;
}

export class EntityResultSet implements IEntityResultSet {
  _results: IEntity[];
  _size?: number;

  constructor(results: IEntity[] = [], size?: number) {
    this._results = results;
    this._size = size;
  }

  get results(): IEntity[] {
    return this._results;
  }

  get size(): number {
    return this._size ?? this._results.length;
  }
}
