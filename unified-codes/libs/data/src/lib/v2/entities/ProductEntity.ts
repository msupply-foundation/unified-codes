import { EEntityType, IEntity, Entity } from './Entity';
import { IRouteEntity, RouteEntity } from './RouteEntity';
import { IProperty, Property } from '../properties';


export enum EProductField {
    Code = 'code',
    Name = 'name',
    Type = 'type',
    Combines = 'combines',
    Children = 'children',
    Properties = 'properties',
};

export type IProductEntityChild = IRouteEntity;
export type IProductEntityChildren = IProductEntityChild[];

export type IProductEntityProperty = IProperty;
export type IProductEntityProperties = IProductEntityProperty[];

export interface IProductEntity extends IEntity {
  type: EEntityType.Product;
  combines?: IProductEntity[];
  children?: IProductEntityChildren;
  properties?: IProductEntityProperties;
}

export class ProductEntity extends Entity implements IProductEntity {
  readonly type: EEntityType.Product;
  readonly combines?: IProductEntity[];
  readonly children?: IProductEntityChildren;
  readonly properties?: IProductEntityProperties;

  constructor(product: IProductEntity) {
    super(product);
    this.type = EEntityType.Product;
    this.combines = product.combines?.map((sibling: IProductEntity) => new ProductEntity(sibling));
    this.children = product.children?.map((child: IProductEntityChild) => new RouteEntity(child));
    this.properties = product.properties?.map((property: IProductEntityProperty) => new Property(property));
  }
}

export default ProductEntity;
