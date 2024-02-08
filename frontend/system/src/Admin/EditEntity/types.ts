import { EntityDetailsFragment } from '../../Entities/api/operations.generated';

export interface EntityDetails extends EntityDetailsFragment {
  children?: EntityDetails[];
}
export interface Property {
  id: string;
  code: string;
  type: string;
  value: string;
}

export interface Entity {
  id: string;
  code?: string;
  name: string;
  properties?: Property[];
}

export interface AlternativeName {
  id: string;
  name: string;
  code?: string;
}

export interface PackSize extends Entity {}

export interface ImmediatePackaging extends Entity {
  packSizes: PackSize[];
}

export interface Unit extends Entity {
  immediatePackagings: ImmediatePackaging[];
}

export interface Strength extends Entity {
  units: Unit[];
}
export interface Form extends Entity {
  strengths: Strength[];
}
export interface Route extends Entity {
  forms: Form[];
}
export interface DrugInput extends Entity {
  alternativeNames: AlternativeName[];
  routes: Route[];
}

export interface ExtraDescription extends Entity {
  packSizes: PackSize[];
}
export interface Presentation extends Entity {
  extraDescriptions: ExtraDescription[];
  packSizes: PackSize[];
}
export interface ConsumableInput extends Entity {
  alternativeNames: AlternativeName[];
  presentations: Presentation[];
  extraDescriptions: ExtraDescription[];
}

export interface Brand extends Entity {
  strengths: Strength[];
}

export interface ActiveIngredients extends Entity {
  brands: Brand[];
}

export interface VaccineNameDetails extends Entity {
  activeIngredients: ActiveIngredients[];
}

export interface VaccineForm extends Entity {
  activeIngredients: ActiveIngredients[];
  details: VaccineNameDetails[];
}
export interface VaccineRoute extends Entity {
  forms: VaccineForm[];
}

export interface VaccineInput extends Entity {
  alternativeNames: AlternativeName[];
  routes: VaccineRoute[];
}
