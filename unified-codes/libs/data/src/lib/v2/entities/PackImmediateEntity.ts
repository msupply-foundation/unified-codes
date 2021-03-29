import { EEntityField, EEntityType, IEntity, Entity } from './Entity';
import { IPackSizeEntity, PackSizeEntity } from './PackSizeEntity';
import { IProperty, Property } from '../properties/Property';

export type EPackImmediateEntityField = EEntityField;

export type IPackImmediateEntityChild = IPackSizeEntity;
export type IPackImmediateEntityChildren = IPackImmediateEntityChild[];

export type IPackImmediateEntityProperty = IProperty;
export type IPackImmediateEntityProperties = IPackImmediateEntityProperty[];

export interface IPackImmediateEntity extends IEntity {
  code: string;
  name: string;
  type: EEntityType.PackImmediate;
  children?: IPackImmediateEntityChild[];
  properties?: IPackImmediateEntityProperty[];
}

export class PackImmediateEntity extends Entity implements IPackImmediateEntity {
  readonly type: EEntityType.PackImmediate;
  readonly children?: IPackImmediateEntityChildren;
  readonly properties?: IPackImmediateEntityProperties;

  constructor(packImmediate: IPackImmediateEntity) {
    super(packImmediate);
    this.children = packImmediate.children?.map(
      (child: IPackImmediateEntityChild) => new PackSizeEntity(child)
    );
    this.properties = packImmediate.properties?.map(
      (property: IProperty) => new Property(property)
    );
  }
}

export default PackImmediateEntity;
