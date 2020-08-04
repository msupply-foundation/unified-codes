import { Property } from "./Property";

export type EntityNode = {
  code: string;
  description: string;
  type: string;
  properties?: Property[];
};

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

  matches(pattern: string) {
    const texts = [this._code, this._description];
    return texts.some((text) =>
      text.toLowerCase().includes(pattern.toLowerCase())
    );
  }
}

export default Entity;
