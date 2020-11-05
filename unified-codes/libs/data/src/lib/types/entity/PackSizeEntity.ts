import { IManufacturerEntity, ManufacturerEntity } from './ManufacturerEntity';
import { EEntityField, EEntityType, IEntity, Entity } from './Entity';
import { IPackOuterEntity, PackOuterEntity } from './PackOuterEntity';
import { IProperty, Property } from '../Property';

export type EPackSizeEntityField = EEntityField;

export type IPackSizeEntityChild = IPackOuterEntity | IManufacturerEntity;
export type IPackSizeEntityChildren = IPackSizeEntityChild[];

export type IPackSizeEntityProperty = IProperty;
export type IPackSizeEntityProperties = IPackSizeEntityProperty[];

export interface IPackSizeEntity extends IEntity {
  code: string;
  name: string;
  type: EEntityType.PackSize;
  children?: IPackSizeEntityChild[];
  properties?: IPackSizeEntityProperty[];
}

export class PackSizeEntity extends Entity implements IPackSizeEntity {
  readonly type: EEntityType.PackSize;
  readonly children?: IPackSizeEntityChildren;
  readonly properties?: IPackSizeEntityProperties;

  constructor(packSize: IPackSizeEntity) {
    super(packSize);
    this.children = packSize.children?.map((child: IPackSizeEntityChild) => {
        if (child.type === EEntityType.PackOuter) return new PackOuterEntity(child);
        else return new ManufacturerEntity(child);
    });
    this.properties = packSize.properties?.map((property: IProperty) => new Property(property));
  }
}

export default PackSizeEntity;
