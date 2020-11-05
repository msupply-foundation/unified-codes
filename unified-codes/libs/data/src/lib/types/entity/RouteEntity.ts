import Entity, { EEntityField, EEntityType, IEntity } from './Entity';
import FormEntity, { IFormEntity } from './FormEntity';
import { IProperty, Property } from '../Property';

export type ERouteField = EEntityField;

export type IRouteEntityChild = IFormEntity;
export type IRouteEntityChildren = IRouteEntityChild[];

export type IRouteEntityProperty = IProperty;
export type IRouteEntityProperties = IRouteEntityProperty[];

export interface IRouteEntity extends IEntity {
  type: EEntityType.Route;
  children?: IRouteEntityChildren;
  properties?: IRouteEntityProperties;
}

export class RouteEntity extends Entity implements IRouteEntity {
  readonly type: EEntityType.Route;
  readonly children?: IRouteEntityChildren;
  readonly properties?: IRouteEntityProperties;

  constructor(route: IRouteEntity) {
    super(route);
    this.type = EEntityType.Route;
    this.children = route.children?.map((child: IRouteEntityChild) => new FormEntity(child));
    this.properties = route.properties?.map((property: IProperty) => new Property(property));
  }
}

export default RouteEntity;
