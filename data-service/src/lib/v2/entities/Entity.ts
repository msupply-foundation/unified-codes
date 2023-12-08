import { IProperty, Property } from '../properties';

export enum EEntityField {
  Code = 'code',
  Name = 'name',
  Type = 'type',
  Children = 'children',
  Properties = 'properties',
}

export enum EEntityCategory {
  DRUG = 'Drug',
  CONSUMABLE = 'Consumable',
  OTHER = 'Other',
}

export enum EEntityType {
  Root = 'Root',
  Category = 'Category',
  Product = 'Product',
  Route = 'Route',
  Form = 'Form',
  FormQualifier = 'FormQualifier',
  DoseStrength = 'DoseStrength',
  Unit = 'Unit',
  PackImmediate = 'PackImmediate',
  PackSize = 'PackSize',
  PackOuter = 'PackOuter',
  Manufacturer = 'Manufacturer',
  Brand = 'Brand',
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
    const [entity] =
      this.children?.filter((child: IEntity) => child.code === code) ?? [];
    return entity;
  }

  getProperty(type: string): IProperty {
    const [property] =
      this.properties?.filter(
        (property: IProperty) => property.type === type
      ) ?? [];
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
