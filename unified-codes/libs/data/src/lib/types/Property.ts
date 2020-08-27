export interface IProperty {
  type: string;
  value: string;
  properties?: IProperty[];
};

export class Property implements IProperty {
  private _type: string;
  private _value: string;
  private _properties: IProperty[];

  constructor(property: IProperty) {
    this._type = property.type;
    this._value = property.value;
    this._properties = property.properties;
  }

  get type(): string {
    return this._type
  };

  get value(): string { 
    return this._value 
  };

  get properties(): IProperty[] {
    return this._properties 
  };

  matchesType(pattern: string) {
    return this.type.toLowerCase().includes(pattern.toLowerCase());
  }

  matchesValue(pattern: string) {
    return this.value.toLowerCase().includes(pattern.toLowerCase());
  }

  matchesProperty(property: Property) {
    return this.properties?.includes(property);
  }
}

export default Property;
