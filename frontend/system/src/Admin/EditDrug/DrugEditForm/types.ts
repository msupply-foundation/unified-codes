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
