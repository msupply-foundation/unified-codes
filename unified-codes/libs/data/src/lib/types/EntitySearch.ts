export interface IEntitySearchFilter {
  code: string;
  description: string;
  orderDesc: boolean;
  orderBy: string;
  type: string;
}

export interface IEntitySearchRequest {
  filter: IEntitySearchFilter;
  first: number;
  offset: number;
}

export class EntitySearchFilter implements IEntitySearchFilter {
  _code: string;
  _description: string;
  _orderDesc: boolean;
  _orderBy: string;
  _type: string;

  constructor(
    description?: string,
    code?: string,
    type?: string,
    orderBy?: string,
    orderDesc?: boolean
  ) {
    this._code = code || '';
    this._description = description || '';
    this._orderDesc = !!orderDesc;
    this._orderBy = orderBy || 'description';
    this._type = type || 'medicinal_product';
  }

  get code(): string {
    return this._code;
  }

  get description(): string {
    return this._description;
  }

  get orderDesc(): boolean {
    return this._orderDesc;
  }

  get orderBy(): string {
    return this._orderBy;
  }

  get type(): string {
    return this._type;
  }
}

export class EntitySearchRequest implements IEntitySearchRequest {
  _filter: IEntitySearchFilter;
  _first: number;
  _offset: number;

  constructor(filter?: IEntitySearchFilter, first?: number, offset?: number) {
    this._filter = filter || new EntitySearchFilter();
    this._first = first || 25;
    this._offset = offset || 0;
  }

  get filter(): IEntitySearchFilter {
    return this._filter;
  }

  get first(): number {
    return this._first;
  }

  get offset(): number {
    return this._offset;
  }
}
