import { IEntity } from './Entity';

export interface IEntityCollection {
  data: IEntity[];
  totalLength: number;
}

export class EntityCollection implements IEntityCollection {
  _data: IEntity[];
  _totalLength: number;

  constructor(data: IEntity[] = [], totalLength?: number) {
    this._data = data;
    this._totalLength = totalLength ?? data.length;
  }

  get data(): IEntity[] {
    return this._data;
  }

  get totalLength(): number {
    return this._totalLength;
  }
}
