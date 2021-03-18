import { EEntityCategory, EEntityField, EEntityType } from '@unified-codes/data/v1';

export interface IExplorerParameters {
  code?: string;
  description?: string;
  orderBy?: EEntityField;
  orderDesc?: boolean;
  categories?: EEntityCategory[];
  types?: EEntityType[];
  page?: number;
  rowsPerPage?: number;
}

export class ExplorerQuery {
  private _code: string;
  private _description: string;
  private _orderBy: EEntityField;
  private _orderDesc: boolean;
  private _categories: EEntityCategory[];
  private _types: EEntityType[];
  private _page: number;
  private _rowsPerPage: number;

  constructor({
    code = '',
    description = '',
    orderBy = EEntityField.DESCRIPTION,
    orderDesc = false,
    categories = [EEntityCategory.DRUG, EEntityCategory.MEDICINAL_PRODUCT, EEntityCategory.OTHER],
    types = [EEntityType.DRUG],
    page = 0,
    rowsPerPage = 25,
  }: IExplorerParameters) {
    this._code = code;
    this._description = description;
    this._orderBy = orderBy;
    this._orderDesc = orderDesc;
    this._categories = categories;
    this._types = types;
    this._page = page;
    this._rowsPerPage = rowsPerPage;
  }

  private get _first(): number {
    return this._rowsPerPage;
  }

  private get _offset(): number {
    return this._rowsPerPage * this._page;
  }

  private get _filterString(): string {
    const codeFilterString = JSON.stringify(this._code);
    const categoryFilterString = JSON.stringify(this._categories);
    const descriptionFilterString = JSON.stringify(this._description);
    // TODO: update mSupply to query types as JSON array.
    const typesFilterString = `"${this._types}"`;
    const orderByFilterString = JSON.stringify(this._orderBy);
    const orderDescFilterString = JSON.stringify(this._orderDesc);
    
    const codeFilter = `code: ${codeFilterString}`;
    const categoryFilter = `categories: ${categoryFilterString}`;
    const descriptionFilter = `description: ${descriptionFilterString}`;
    const typesFilter = `type: ${typesFilterString}`;
    const orderByFilter = `orderBy: { field: ${orderByFilterString} descending: ${orderDescFilterString} }`;
    return `{ ${codeFilter} ${categoryFilter} ${descriptionFilter} ${typesFilter} ${orderByFilter} }`;
  }

  public toString(): string {
    return `{
            entities(filter: ${this._filterString} offset: ${this._offset} first: ${this._first}) {
                data {
                    code
                    description
                    type
                    uid
                },
                totalLength,
            }
        }`;
  }
}

export default ExplorerQuery;
