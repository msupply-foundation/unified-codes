import { IEntity } from './Entity';

export interface IEntityCollection {
  data: Array<IEntity>;
  first: number;
  hasMore: boolean;
  offset: number;
  totalLength: number;
}

export class EntityCollection implements IEntityCollection {
  _data: Array<IEntity>;
  _first: number;
  _offset: number;
  _totalLength: number;

  constructor(data?: Array<IEntity>, totalLength?: number, first?: number, offset?: number) {
    this._data = data || ([] as Array<IEntity>);
    this._first = first || 25; // default results per page
    this._offset = offset || 0;
    this._totalLength = totalLength === undefined ? 0 : totalLength;
  }

  get data(): Array<IEntity> {
    return this._data;
  }

  get first(): number {
    return this._first;
  }

  get hasMore(): boolean {
    return this._offset + this._first < this._totalLength;
  }

  get offset(): number {
    return this._offset;
  }

  get totalLength(): number {
    return this._totalLength;
  }
}
