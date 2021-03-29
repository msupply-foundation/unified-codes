
export enum EPropertyType {
  RX_NAV = 'code_rxnav',
  NZULM = 'code_nzulm',
  WHO_EML = 'who_eml',
  UNSPSC = 'code_unspsc'
}

export interface IProperty {
  type: string;
  value: string;
  properties?: IProperty[];
}

export class Property {
  readonly type: string;
  readonly value: string;
  readonly properties?: Property[];

  constructor(property: IProperty) {
    this.type = property.type;
    this.value = property.value;
    this.properties = property.properties?.map((property: IProperty) => new Property(property));
  }
}

export default IProperty;
