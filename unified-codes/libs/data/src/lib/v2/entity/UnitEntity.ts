import { EEntityField, EEntityType, Entity, IEntity } from './Entity';
import { IPackImmediateEntity, PackImmediateEntity } from './PackImmediateEntity';
import { IPackSizeEntity, PackSizeEntity } from './PackSizeEntity';
import { IProperty, Property } from '../Property';

export type EUnitEntityField = EEntityField;

export type IUnitEntityChild = IPackImmediateEntity | IPackSizeEntity;
export type IUnitEntityChildren = IUnitEntityChild[];

export type IUnitEntityProperty = IProperty;
export type IUnitEntityProperties = IUnitEntityProperty[];

export interface IUnitEntity extends IEntity {
  type: EEntityType.Unit;
  children?: IUnitEntityChildren
  properties?: IUnitEntityProperties;
}

export class UnitEntity extends Entity implements IUnitEntity {
  readonly type: EEntityType.Unit;
  readonly children?: IUnitEntityChildren;
  readonly properties?: IUnitEntityProperties;

  constructor(unit: IUnitEntity) {
    super(unit);
    this.type = EEntityType.Unit;
    this.children = unit.children?.map((child: IUnitEntityChild) => {
      if (child.type === EEntityType.PackImmediate) return new PackImmediateEntity(child);
      else return new PackSizeEntity(child);
    });
    this.properties = unit.properties?.map((property: IProperty) => new Property(property));
  }
}

export default UnitEntity;
