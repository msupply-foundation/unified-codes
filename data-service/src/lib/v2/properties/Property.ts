export enum EPropertyField {
  Type = 'type',
  Value = 'value',
}

export enum EPropertyType {
  DrugInteraction = 'drug_interaction',
}

export interface IProperty {
  type: EPropertyType;
  // TODO: strongly type property values.
  value: unknown;
}

// TODO: make Property abstract.
export class Property implements IProperty {
  readonly type: EPropertyType;
  readonly value: unknown;

  constructor(property: IProperty) {
    this.type = property.type;
    this.value = property.value;
  }
}

export default IProperty;
