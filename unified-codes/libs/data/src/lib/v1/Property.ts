export interface IProperty {
  type?: string;
  types?: string[];
  value: string;
  properties?: IProperty[];
}

export class Property {
  readonly type: string;
  readonly value: string;
  readonly properties?: Property[];

  constructor(property: IProperty) {
    this.type = property.type || '';
    this.value = property.value;
    this.properties = property.properties?.map((property: IProperty) => new Property(property));
  }
}

export default IProperty;
