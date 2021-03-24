import { EEntityField, EEntityType, IEntity, Entity } from './Entity';
import { IProductEntity, ProductEntity } from './ProductEntity';
import { IProperty, Property } from '../properties';


export enum ECategoryEntityName {
  Drug = 'drug',
  Consumable = 'consumable',
  Other = 'other',
};

export type ECategoryEntityField = EEntityField;

export type ICategoryEntityChild = IProductEntity;
export type ICategoryEntityChildren = ICategoryEntityChild[];

export type ICategoryEntityProperty = IProperty;
export type ICategoryEntityProperties = ICategoryEntityProperty[];

export interface ICategoryEntity extends IEntity {
  name: ECategoryEntityName;
  type: EEntityType.Category;
  children?: ICategoryEntityChildren;
  properties?: ICategoryEntityProperties;
}

export class CategoryEntity extends Entity implements ICategoryEntity {
  readonly name: ECategoryEntityName;
  readonly type: EEntityType.Category;
  readonly children?: ICategoryEntityChildren;
  readonly properties?: ICategoryEntityProperties;

  constructor(category: ICategoryEntity) {
    super(category);
    this.type = EEntityType.Category;
    this.children = category.children?.map((child: ICategoryEntityChild) => new ProductEntity(child));
    this.properties = category.properties?.map((property: IProperty) => new Property(property));
  }
}

export default CategoryEntity;
