import { DrugInteraction, IDrugInteraction } from './DrugInteraction';
import { GraphQLError } from 'graphql';

export interface IDrugInteractions {
  data: IDrugInteraction[];
  errors: GraphQLError[];
  rxcui: string;
}

export class DrugInteractions implements IDrugInteractions {
  private _data: DrugInteraction[];
  private _errors: GraphQLError[];
  private _rxcui: string;

  constructor(interactions: DrugInteraction[], rxcui: string, errors?: GraphQLError[]) {
    this._data = interactions;
    this._errors = errors || [];
    this._rxcui = rxcui;
  }

  get data(): DrugInteraction[] {
    return this._data;
  }

  get errors(): GraphQLError[] {
    return this._errors;
  }

  get rxcui(): string {
    return this._rxcui;
  }
}

export default DrugInteractions;
