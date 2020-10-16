export interface IProperty {
  type: string;
  value: string;
  properties?: IProperty[];
}

export class Property {
  private _type: string;
  private _value: string;
  private _properties?: Property[];

  constructor(property: IProperty) {
    this._type = property.type;
    this._value = property.value;
    this._properties = property.properties?.map((property: IProperty) => new Property(property));
  }

  get type(): string {
    return this._type;
  }

  get value(): string {
    return this._value;
  }

  get properties(): Property[] | undefined {
    return this._properties;
  }
}

export default IProperty;
