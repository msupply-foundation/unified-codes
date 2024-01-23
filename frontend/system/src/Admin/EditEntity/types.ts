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

export interface ImmediatePackaging extends Entity {}

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
  routes: Route[];
}

export interface ExtraDescription extends Entity {}
export interface Presentation extends Entity {
  extraDescriptions: ExtraDescription[];
}
export interface ConsumableInput extends Entity {
  presentations: Presentation[];
  extraDescriptions: ExtraDescription[];
}

export interface Brand extends Entity {
  routes: Route[];
}

export interface ActiveIngredients extends Entity {
  brands: Brand[];
}

export interface VaccineNameDetails extends Entity {
  activeIngredients: ActiveIngredients[];
}

export interface VaccineInput extends Entity {
  activeIngredients: ActiveIngredients[];
  details: VaccineNameDetails[];
}
