import { IPaginatable } from './Pagination';
import { Property } from './Property';

export interface IEntity extends IPaginatable {
  code: string;
  description: string;
  type: string;
  properties?: Property[];
}

export class Entity implements IEntity {
  private _code: string;
  private _cursor?: string;
  private _description: string;
  private _type: string;
  private _properties?: Property[];

  constructor(entity: IEntity) {
    this._code = entity.code;
    this._cursor = entity.cursor;
    this._description = entity.description;
    this._type = entity.type;
    this._properties = entity.properties;
  }

  get code(): string {
    return this._code;
  }

  get cursor(): string {
    return this._cursor || '';
  }

  get description(): string {
    return this._description;
  }

  get type(): string {
    return this._type;
  }

  get properties(): Property[] | undefined {
    return this._properties;
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
