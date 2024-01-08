import { EntityDetailsFragment } from '../../Entities/api/operations.generated';

export interface EntityDetails extends EntityDetailsFragment {
  children?: EntityDetails[];
}
export interface Property {
  id: string;
  type: string;
  value: string;
}

export interface Entity {
  id: string;
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
