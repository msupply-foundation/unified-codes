export interface IDrugInteraction {
  name: string;
  description: string;
  severity: string;
  source: string;
  rxcui: string;
}

export class DrugInteraction implements IDrugInteraction {
  private _name: string;
  private _description: string;
  private _severity: string;
  private _source: string;
  private _rxcui: string;

  constructor(drugInteraction: IDrugInteraction) {
    this._name = drugInteraction.name;
    this._description = drugInteraction.description;
    this._severity = drugInteraction.severity;
    this._source = drugInteraction.source;
    this._rxcui = drugInteraction.rxcui;
  }

  get name(): string {
    return this._name;
  }

  get description(): string {
    return this._description;
  }

  get severity(): string {
    return this._severity;
  }

  get source(): string {
    return this._source;
  }

  get rxcui(): string {
    return this._rxcui;
  }
}

export default DrugInteraction;
