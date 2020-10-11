import { EEntityField, EEntityType } from '@unified-codes/data';

export interface IExplorerParameters {
    code?: string;
    description?: string;
    orderBy?: EEntityField;
    orderDesc?: boolean;
    types?: EEntityType[];
    page?: number;
    rowsPerPage?: number;
}

export class ExplorerQuery {
    private _code: string;
    private _description: string;
    private _orderBy: EEntityField;
    private _orderDesc: boolean;
    private _types: EEntityType[];
    private _page: number;
    private _rowsPerPage: number;

    constructor({
        code = '',
        description = '',
        orderBy = EEntityField.DESCRIPTION,
        orderDesc = false,
        types = [EEntityType.MEDICINAL_PRODUCT],
        page = 0,
        rowsPerPage = 25,
    }: IExplorerParameters) {
        this._code = code;
        this._description = description;
        this._orderBy = orderBy;
        this._orderDesc = orderDesc;
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
        const filterCode = `code: "${this._code}"`;
        const filterDescription = `description: "${this._description}"`;
        const filterTypes = `type: "[${this._types}]"`;
        const filterOrderBy = `orderBy: { field: "${this._orderBy}" descending: ${this._orderDesc} }`;
        return `{ ${filterCode} ${filterDescription} ${filterTypes} ${filterOrderBy} }`;
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