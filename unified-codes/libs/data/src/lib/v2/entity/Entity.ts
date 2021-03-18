import { IProperty, Property } from '../Property';

export enum EEntityCategory {
  DRUG = 'drug',
  CONSUMABLE = 'consumable',
  OTHER = 'other',
}

export enum EEntityField {
  Code = 'code',
  Name = 'name',
  Type = 'type',
  Children = 'children',
  Properties = 'properties',
};

export enum EEntityType {
  Category = 'category',
  Product = 'product',
  Route = 'route',
  Form = 'form',
  FormQualifier = 'form_qualifier',
  Unit = 'unit',
  PackImmediate = 'pack_immediate',
  PackSize = 'pack_size',
  PackOuter = 'pack_outer',
  Manufacturer = 'manufacturer',
  Brand = 'brand',
}

export interface IEntity {
  code: string;
  name: string;
  type: EEntityType | string;
  children?: IEntity[];
  properties?: IProperty[];
}

export abstract class Entity implements IEntity {
  readonly code: string;
  readonly name: string;
  abstract readonly type: EEntityType;
  abstract readonly children?: IEntity[];
  abstract readonly properties?: IProperty[];

  constructor(entity: IEntity) {
    this.code = entity.code;
    this.name = entity.name;
  }

  getChild(code: string): IEntity {
    const [entity] = this.children?.filter((child: IEntity) => child.code === code) ?? [];
    return entity;
  }

  getProperty(type: string): IProperty {
    const [property] = this.properties?.filter((property: IProperty) => property.type === type) ?? [];
    return property;
  }

  matchesCode(pattern: string) {
    return this.code.toLowerCase().includes(pattern.toLowerCase());
  }

  matchesDescription(pattern: string) {
    return this.name.toLowerCase().includes(pattern.toLowerCase());
  }

  matchesType(pattern: string) {
    return this.type.toLowerCase().includes(pattern.toLowerCase());
  }

  matchesProperty(property: Property) {
    return this.properties?.includes(property);
  }
}

export default Entity;
