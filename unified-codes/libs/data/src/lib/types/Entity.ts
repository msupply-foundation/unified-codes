import { IDrugInteraction } from './DrugInteraction';
import { IProperty, Property } from './Property';

const productPropertyTypes = ['who_eml'];

export enum EEntityType {
  DRUG = 'drug',
  MEDICINAL_PRODUCT = 'medicinal_product',
  OTHER = 'other',
}

export enum EEntityField {
  CODE = 'code',
  DESCRIPTION = 'description',
  TYPE = 'type',
}

interface IEntityParent {
  parent?: IEntityParent[];
  properties?: IProperty[];
}

// TODO: complete EEntityType enum.
export interface IEntity {
  code: string;
  description: string;
  type: EEntityType | string;
  interactions?: IDrugInteraction[];
  children?: IEntity[];
  properties?: IProperty[];
  parent?: IEntityParent[];
}

export class Entity implements IEntity {
  private _code: string;
  private _description: string;
  private _type: string;
  private _children?: Entity[];
  private _parent?: IEntityParent[];
  private _properties?: Property[];

  constructor(entity: IEntity) {
    this._code = entity.code;
    this._description = entity.description;
    this._type = entity.type;
    this._children = entity.children?.map((child: IEntity) => new Entity(child));
    this._parent = entity.parent;
    this._properties = entity.properties?.map((property: IProperty) => new Property(property));
  }

  get code(): string {
    return this._code;
  }

  get description(): string {
    return this._description;
  }

  get type(): string {
    return this._type;
  }

  get children(): Entity[] | undefined {
    return this._children;
  }

  get parent(): IEntityParent[] | undefined {
    return this._parent;
  }

  get properties(): Property[] | undefined {
    return this._properties;
  }

  getChild(code: string): Entity {
    const [entity] = this._children?.filter((child: IEntity) => child.code === code) ?? [];
    return entity;
  }

  getProperty(type: string): Property {
    const [property] =
      this.properties?.filter((property: IProperty) => property.type === type) ?? [];
    return property;
  }

  getParentProperty(type: string): Property {
    const properties = this.getParentProperties();
    const [property] = properties?.filter((property: IProperty) => property.type === type) ?? [];
    return property ? new Property(property) : undefined;
  }

  matchesCode(pattern: string) {
    return this.code.toLowerCase().includes(pattern.toLowerCase());
  }

  matchesDescription(pattern: string) {
    return this.description.toLowerCase().includes(pattern.toLowerCase());
  }

  matchesType(pattern: string) {
    return this.type.toLowerCase().includes(pattern.toLowerCase());
  }

  matchesProperty(property: Property) {
    return this.properties?.includes(property);
  }

  getParentProperties() {
    let { parent } = this;
    do {
      if (parent?.length) {
        const [parentEntity] = parent;
        if (parentEntity.properties) return parentEntity.properties;
        parent = parentEntity.parent;
      } else {
        parent = undefined;
      }
    } while (!!parent);
  }

  updatePropertiesFromParent() {
    productPropertyTypes.forEach((type) => {
      const parentProperty = this.getParentProperty(type);
      const childProperty = this.getProperty(type);

      if (parentProperty && !childProperty) {
        if (!this.properties) {
          this._properties = [new Property(parentProperty)];
        } else {
          this._properties.push(new Property(parentProperty));
        }
      }
    });
  }
}

export default Entity;
