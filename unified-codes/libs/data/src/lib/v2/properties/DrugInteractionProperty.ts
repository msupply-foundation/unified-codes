import IProperty, { Property, EPropertyType } from './Property';

export interface IDrugInteractionPropertyValue {
  name: string;
  description: string;
  severity: string;
  source: string;
  rxcui: string;
}

export interface IDrugInteractionProperty extends IProperty {
  type: EPropertyType.DrugInteraction;
  value: IDrugInteractionPropertyValue;
}

export class DrugInteractionProperty extends Property implements IDrugInteractionProperty {
  readonly value: IDrugInteractionPropertyValue;

  constructor(interaction: IDrugInteractionProperty) {
    super(interaction);
    this.value = interaction.value;
  }

  get name(): string {
    return this.value.name;
  }

  get description(): string {
    return this.value.description;
  }

  get severity(): string {
    return this.value.severity;
  }

  get source(): string {
    return this.value.source;
  }

  get rxcui(): string {
    return this.value.rxcui;
  }
}

export default DrugInteractionProperty;
