import { Property } from './Property';

export interface IEntity {
  code: string;
  description: string;
  type: string;
  has_property?: Property[];
  has_child?: IEntity[];
}

export class Entity implements IEntity {
  private _code: string;
  private _description: string;
  private _type: string;
  private _has_property?: Property[];
  private _has_child?: IEntity[];

  constructor(entity: IEntity) {
    this._code = entity.code;
    this._description = entity.description;
    this._type = entity.type;
    this._has_property = entity.has_property;
    this._has_child = entity.has_child;
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

  get properties(): Property[] | undefined {
    return this._has_property;
  }

  get children(): IEntity[] | undefined {
    return this._has_child;
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
}

export default Entity;
