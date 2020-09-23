export interface IEntitySortInput {
  descending: boolean;
  field: string;
}
export interface IEntitySearchFilter {
  code: string;
  description: string;
  orderBy: IEntitySortInput;
  type: string;
}

export interface IEntitySearchRequest {
  filter: IEntitySearchFilter;
  first: number;
  offset: number;
}

export class EntitySortInput implements IEntitySortInput {
  _descending: boolean;
  _field: string;

  constructor(field?: string, descending?: boolean) {
    this._field = field || 'description';
    this._descending = !!descending;
  }
  get descending(): boolean {
    return this._descending;
  }

  get field(): string {
    return this._field;
  }
}

export class EntitySearchFilter implements IEntitySearchFilter {
  _code: string;
  _description: string;
  _orderBy: IEntitySortInput;
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
    this._orderBy = new EntitySortInput(orderBy, orderDesc);
    this._type = type || 'drug';
  }

  get code(): string {
    return this._code;
  }

  get description(): string {
    return this._description;
  }

  get orderBy(): IEntitySortInput {
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
