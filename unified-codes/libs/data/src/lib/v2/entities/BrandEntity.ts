import { EEntityField, EEntityType, IEntity, Entity } from './Entity';
import { IProperty, Property } from '../properties';

export type EBrandEntityField = EEntityField;

export type IBrandEntityProperty = IProperty;
export type IBrandEntityProperties = IBrandEntityProperty[];

export interface IBrandEntity extends IEntity {
  type: EEntityType.Brand;
  properties?: IBrandEntityProperties;
}

export class BrandEntity extends Entity implements IBrandEntity {
  readonly type: EEntityType.Brand;
  readonly children: undefined;
  readonly properties: IBrandEntityProperties;

  constructor(brand: IBrandEntity) {
    super(brand);
    this.type = EEntityType.Brand;
    this.properties = brand.properties?.map((property: IProperty) => new Property(property));
  }
}

export default BrandEntity;
