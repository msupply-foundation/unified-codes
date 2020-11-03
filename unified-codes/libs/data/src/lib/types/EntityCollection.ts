import { Entity, IEntity } from './Entity';

export interface IEntityCollection {
  data: IEntity[];
  totalLength: number;
}

export class EntityCollection implements IEntityCollection {
  _data: IEntity[];
  _totalLength: number;

  constructor(data: IEntity[] = [], totalLength?: number) {
    this._data = data.map((entity) => new Entity(entity));
    this._data.forEach((entity: Entity) => entity.updatePropertiesFromParent());
    this._totalLength = totalLength ?? data.length;
  }

  get data(): IEntity[] {
    return this._data;
  }

  get totalLength(): number {
    return this._totalLength;
  }
}
