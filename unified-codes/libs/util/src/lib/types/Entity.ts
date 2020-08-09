import { EntityNode } from "./EntityNode";
import { Property } from "./Property";

export class Entity {
  private _code: string;
  private _description: string;
  private _type: string;
  private _properties?: Property[];

  constructor(entityNode: EntityNode) {
    this._code = entityNode.code;
    this._description = entityNode.description;
    this._type = entityNode.type;
    this._properties = entityNode.properties;
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
    return this.properties.includes(property);
  }
}

export default Entity;
