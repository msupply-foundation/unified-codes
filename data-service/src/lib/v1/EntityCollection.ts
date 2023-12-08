import { IEntity } from './Entity';

export interface IEntityCollection {
  data: IEntity[];
  totalLength: number;
}

export class EntityCollection implements IEntityCollection {
  readonly data: IEntity[];
  readonly totalLength: number;

  constructor(data: IEntity[] = [], totalLength?: number) {
    this.data = data;
    this.totalLength = totalLength ?? data.length;
  }
}
