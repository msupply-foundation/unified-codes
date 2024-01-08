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

export interface Unit extends Entity {}

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

export interface Brand extends Entity {
  routes: Route[];
}

export interface Component extends Entity {
  brands: Brand[];
}

export interface VaccineInput extends Entity {
  components: Component[];
}
