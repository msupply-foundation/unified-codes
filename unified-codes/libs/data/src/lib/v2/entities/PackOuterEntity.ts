import { IManufacturerEntity, ManufacturerEntity } from './ManufacturerEntity';
import { EEntityField, EEntityType, IEntity, Entity } from './Entity';
import { IProperty, Property } from '../properties/Property';

export type EPackOuterEntityField = EEntityField;

export type IPackOuterEntityChild = IManufacturerEntity;
export type IPackOuterEntityChildren = IPackOuterEntityChild[];

export type IPackOuterEntityProperty = IProperty;
export type IPackOuterEntityProperties = IPackOuterEntityProperty[];

export interface IPackOuterEntity extends IEntity {
  code: string;
  name: string;
  type: EEntityType.PackOuter;
  children?: IPackOuterEntityChild[];
  properties?: IPackOuterEntityProperty[];
}

export class PackOuterEntity extends Entity implements IPackOuterEntity {
  readonly type: EEntityType.PackOuter;
  readonly children?: IPackOuterEntityChildren;
  readonly properties?: IPackOuterEntityProperties;

  constructor(packOuter: IPackOuterEntity) {
    super(packOuter);
    this.children = packOuter.children?.map((child: IPackOuterEntityChild) => new ManufacturerEntity(child));
    this.properties = packOuter.properties?.map((property: IProperty) => new Property(property));
  }
}

export default PackOuterEntity;
