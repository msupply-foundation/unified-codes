import { IEntity } from './Entity';
import { IProperty } from './Property';

const productPropertyTypes = ['who_eml'];

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

    data.forEach((entity) => {
      let found = false,
        { parent } = entity;
      do {
        if (parent && parent.length && parent[0]) {
          if (parent[0].properties) {
            this.updatePropertiesFromParent(entity, parent[0].properties);
            found = true;
          }
          parent = parent[0].parent;
        } else {
          parent = undefined;
        }
      } while (!!parent && !found);
      s;
    });
  }

  get data(): IEntity[] {
    return this._data;
  }

  get totalLength(): number {
    return this._totalLength;
  }

  private updatePropertiesFromParent = (entity: IEntity, properties: IProperty[]) => {
    productPropertyTypes.forEach((productPropertyType) => {
      const parentProperty = properties.find((x) => x.type === productPropertyType);
      const childProperty = entity.properties?.find((x) => x.type === productPropertyType);

      if (parentProperty && !childProperty) {
        if (!entity.properties) {
          entity.properties = [parentProperty];
        } else {
          entity.properties.push(parentProperty);
        }
      }
    });
  };
}
