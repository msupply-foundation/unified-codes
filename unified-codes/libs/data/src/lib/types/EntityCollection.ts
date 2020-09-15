import { IEntity } from './Entity';

export interface IEntityCollection {
  data: Array<IEntity>;
  totalLength: number;
}

export class EntityCollection implements IEntityCollection {
  _data: Array<IEntity>;
  _totalLength: number;

  constructor(data?: Array<IEntity>, totalLength?: number) {
    this._data = data || ([] as Array<IEntity>);
    this._totalLength = totalLength === undefined ? 0 : totalLength;
  }

  get data(): Array<IEntity> {
    return this._data;
  }

  get totalLength(): number {
    return this._totalLength;
  }
}
