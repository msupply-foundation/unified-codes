import { EEntityType, IEntity, Entity } from './Entity';
import { IFormQualifierEntity, FormQualifierEntity } from './FormQualifierEntity';
import { IUnitEntity, UnitEntity } from './UnitEntity';
import { IProperty, Property } from '../properties/Property';

export enum EFormField {
  Code = 'code',
  Name = 'name',
  Type = 'type',
  Children = 'children',
  Properties = 'properties',
}

export type IFormEntityChild = IFormQualifierEntity | IUnitEntity;
export type IFormEntityChildren = IFormEntityChild[];

export type IFormEntityProperty = IProperty;
export type IFormEntityProperties = IFormEntityProperty[];

export interface IFormEntity extends IEntity {
  type: EEntityType.Form;
  children?: IFormEntityChildren;
  properties?: IFormEntityProperties;
}

export class FormEntity extends Entity implements IFormEntity {
  readonly type: EEntityType.Form;
  readonly children?: IFormEntityChildren;
  readonly properties?: IFormEntityProperties;

  constructor(form: IFormEntity) {
    super(form);
    this.children = form.children?.map((child: IFormEntityChild) => {
      if (child.type === EEntityType.FormQualifier) return new FormQualifierEntity(child);
      else return new UnitEntity(child);
    });
    this.properties = form.properties?.map((property: IProperty) => new Property(property));
  }
}

export default FormEntity;
