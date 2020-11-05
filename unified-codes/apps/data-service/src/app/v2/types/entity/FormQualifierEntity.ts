import { EEntityField, EEntityType, IEntity, Entity } from './Entity';
import { IUnitEntity, UnitEntity } from './UnitEntity';
import { IProperty, Property } from '../Property';

export type EFormQualifierField = EEntityField;

export type IFormQualifierEntityChild = IUnitEntity;
export type IFormQualifierEntityChildren = IFormQualifierEntityChild[];

export type IFormQualifierEntityProperty = IProperty;
export type IFormQualifierEntityProperties = IFormQualifierEntityProperty[];

export interface IFormQualifierEntity extends IEntity {
  code: string;
  name: string;
  type: EEntityType.FormQualifier;
  children?: IFormQualifierEntityChildren;
  properties?: IFormQualifierEntityProperties;
}

export class FormQualifierEntity extends Entity implements IFormQualifierEntity {
  readonly type: EEntityType.FormQualifier;
  readonly children?: IFormQualifierEntityChildren;
  readonly properties?: IFormQualifierEntityProperties;

  constructor(formQualifier: IFormQualifierEntity) {
    super(formQualifier);
    this.type = EEntityType.FormQualifier;
    this.children = formQualifier.children?.map((child: IFormQualifierEntityChild) => new UnitEntity(child));
    this.properties = formQualifier.properties?.map((property: IProperty) => new Property(property));
  }
}

export default FormQualifierEntity;
