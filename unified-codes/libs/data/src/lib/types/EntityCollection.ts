import { IEntity } from './Entity';

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
      const { form } = entity;
      if (!form || !form.length) return;

      const { category } = form[0];
      if (!category || !category.length) return;

      const { product } = category[0];
      if (!product || !product.length) return;

      const { properties } = product[0];
      if (!properties || !properties.length) return;

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
    });
  }

  get data(): IEntity[] {
    return this._data;
  }

  get totalLength(): number {
    return this._totalLength;
  }
}
