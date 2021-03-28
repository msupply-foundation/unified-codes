import { EEntityField, EEntityType, IEntity, Entity } from './Entity';
import { IProperty, Property } from '../properties/Property';
import BrandEntity, { IBrandEntity } from './BrandEntity';

export type EManufacturerEntityField = EEntityField;

export type IManufacturerEntityChild = IBrandEntity;
export type IManufacturerEntityChildren = IManufacturerEntityChild[];

export type IManufacturerEntityProperty = IProperty;
export type IManufacturerEntityProperties = IManufacturerEntityProperty[];

export interface IManufacturerEntity extends IEntity {
  type: EEntityType.Manufacturer;
  children?: IManufacturerEntityChildren;
  properties?: IManufacturerEntityProperties;
}

export class ManufacturerEntity extends Entity implements IManufacturerEntity {
  readonly type: EEntityType.Manufacturer;
  readonly children?: IManufacturerEntityChildren;
  readonly properties?: IManufacturerEntityProperties;

  constructor(manufacturer: IManufacturerEntity) {
    super(manufacturer);
    this.type = EEntityType.Manufacturer;
    this.children = manufacturer.children?.map((child: IManufacturerEntityChild) => new BrandEntity(child));
    this.properties = manufacturer.properties?.map((property: IProperty) => new Property(property));
  }
}

export default ManufacturerEntity;
