import { Action } from 'redux';

import { EEntityField, IEntity } from '@unified-codes/data';

export interface IExplorerSearchBarUpdateInputAction extends Action<string> {
    input: string;
}

export interface IExplorerSearchBarUpdateLabelAction extends Action<string> {
    label: string;
}


export interface IExplorerTableUpdateRowsPerPageAction extends Action<string> {
    rowsPerPage: number;
}

export interface IExplorerTableUpdatePageAction extends Action<string> {
    page: number;
}

export interface IExplorerTableUpdateOrderByAction extends Action<string> {
    orderBy: EEntityField;
}

export interface IExplorerTableUpdateOrderDescAction extends Action<string> {
    orderDesc: boolean;
}

export interface IExplorerTableUpdateFilterByAction extends Action<string> {
    filterBy: string;
}

export interface IExplorerTableFetchEntitiesAction extends Action<string> { };

export interface IExplorerTableFetchEntitiesSuccessAction extends Action<string> {
    entities: { data: IEntity[], totalLength: number };
};

export interface IExplorerTableFetchEntitiesFailureAction extends Action<string> {
    error: Error;
};

export interface IExplorerToggleBarUpdateFilterByDrugAction extends Action<string> {
    filterByDrug: boolean;
}

export interface IExplorerToggleBarUpdateFilterByUnitOfUseAction extends Action<string> {
    filterByUnitOfUse: boolean;
}

export interface IExplorerToggleBarUpdateFilterByOtherAction extends Action<string> {
    filterByOther: boolean;
}

export interface IExplorerToggleBarToggleByDrugAction extends Action<string> { }

export interface IExplorerToggleBarToggleByUnitOfUseAction extends Action<string> { }

export interface IExplorerToggleBarToggleByOtherAction extends Action<string> { }

export type IExplorerSearchBarAction =
    IExplorerSearchBarUpdateInputAction |
    IExplorerSearchBarUpdateLabelAction;

export type IExplorerTableAction =
    IExplorerTableUpdateRowsPerPageAction |
    IExplorerTableUpdatePageAction |
    IExplorerTableUpdateOrderByAction |
    IExplorerTableUpdateOrderDescAction |
    IExplorerTableUpdateFilterByAction |
    IExplorerTableFetchEntitiesAction |
    IExplorerTableFetchEntitiesSuccessAction |
    IExplorerTableFetchEntitiesFailureAction;

export type IExplorerToggleBarAction =
    IExplorerToggleBarUpdateFilterByDrugAction |
    IExplorerToggleBarUpdateFilterByUnitOfUseAction |
    IExplorerToggleBarUpdateFilterByOtherAction |
    IExplorerToggleBarToggleByDrugAction |
    IExplorerToggleBarToggleByUnitOfUseAction |
    IExplorerToggleBarToggleByOtherAction;

export type IExplorerAction = IExplorerSearchBarAction | IExplorerTableAction | IExplorerToggleBarAction;

export const EXPLORER_SEARCH_BAR_ACTIONS = {
    UPDATE_INPUT: 'explorer/searchBar/updateInput',
    UPDATE_LABEL: 'explorer/searchBar/updateLabel',
};

export const EXPLORER_TABLE_ACTIONS = {
    FETCH_ENTITIES: 'explorer/table/fetchEntities',
    FETCH_ENTITIES_SUCCESS: 'explorer/table/fetchEntitiesSuccess',
    FETCH_ENTITIES_FAILURE: 'explorer/table/fetchEntitiesFailure',
    UPDATE_FILTER_BY: 'explorer/table/updateFilterBy',
    UPDATE_ORDER_BY: 'explorer/table/updateOrderBy',
    UPDATE_ORDER_DESC: 'explorer/table/updateOrderDesc',
    UPDATE_ROWS_PER_PAGE: 'explorer/table/updateRowsPerPage',
    UPDATE_PAGE: 'explorer/table/updatePage',
};

export const EXPLORER_TOGGLE_BAR_ACTIONS = {
    UPDATE_FILTER_BY_DRUG: 'explorer/toggleBar/updateFilterByDrug',
    UPDATE_FILTER_BY_MEDICINAL_PRODUCT: 'explorer/toggleBar/updateFilterByUnitOfUse',
    UPDATE_FILTER_BY_OTHER: 'explorer/toggleBar/updateFilterByOther',
    TOGGLE_FILTER_BY_DRUG: 'explorer/toggleBar/toggleFilterByDrug',
    TOGGLE_FILTER_BY_MEDICINAL_PRODUCT: 'explorer/toggleBar/toggleFilterByMedicinalProduct',
    TOGGLE_FILTER_BY_OTHER: 'explorer/toggleBar/toggleFilterByOther',
};


const updateInput = (input: string) => ({
    type: EXPLORER_SEARCH_BAR_ACTIONS.UPDATE_INPUT,
    input,
});

const updateLabel = (label: string) => ({
    type: EXPLORER_SEARCH_BAR_ACTIONS.UPDATE_LABEL,
    label,
});

const updateRowsPerPage = (rowsPerPage: number) => ({
    type: EXPLORER_TABLE_ACTIONS.UPDATE_ROWS_PER_PAGE,
    rowsPerPage,
});

const updatePage = (page: number) => ({
    type: EXPLORER_TABLE_ACTIONS.UPDATE_PAGE,
    page,
})

const updateFilterBy = (filterBy: string) => ({
    type: EXPLORER_TABLE_ACTIONS.UPDATE_FILTER_BY,
    filterBy,
})

const updateOrderBy = (orderBy: EEntityField) => ({
    type: EXPLORER_TABLE_ACTIONS.UPDATE_ORDER_BY,
    orderBy,
});

const updateOrderDesc = (orderDesc: boolean) => ({
    type: EXPLORER_TABLE_ACTIONS.UPDATE_ORDER_DESC,
    orderDesc,
});

export const fetchEntities = () => ({
    type: EXPLORER_TABLE_ACTIONS.FETCH_ENTITIES
});

export const fetchEntitiesSuccess = (entities: IEntity[]) => ({
    type: EXPLORER_TABLE_ACTIONS.FETCH_ENTITIES_SUCCESS,
    entities,
});

export const fetchEntitiesFailure = (error: Error) => ({
    type: EXPLORER_TABLE_ACTIONS.FETCH_ENTITIES_FAILURE,
    error,
});

const updateFilterByDrug = (filterByDrug: boolean) => ({
    type: EXPLORER_TOGGLE_BAR_ACTIONS.UPDATE_FILTER_BY_DRUG,
    filterByDrug,
});

const updateFilterByMedicinalProduct = (filterByMedicinalProduct: boolean) => ({
    type: EXPLORER_TOGGLE_BAR_ACTIONS.UPDATE_FILTER_BY_MEDICINAL_PRODUCT,
    filterByMedicinalProduct,
});

const updateFilterByOther = (filterByOther: boolean) => ({
    type: EXPLORER_TOGGLE_BAR_ACTIONS.UPDATE_FILTER_BY_OTHER,
    filterByOther,
});

const toggleFilterByDrug = () => ({
    type: EXPLORER_TOGGLE_BAR_ACTIONS.TOGGLE_FILTER_BY_DRUG,
});

const toggleFilterByMedicinalProduct = () => ({
    type: EXPLORER_TOGGLE_BAR_ACTIONS.TOGGLE_FILTER_BY_MEDICINAL_PRODUCT,
});

const toggleFilterByOther = () => ({
    type: EXPLORER_TOGGLE_BAR_ACTIONS.TOGGLE_FILTER_BY_OTHER,
});

export const ExplorerSearchBarActions = {
    updateInput,
    updateLabel
};

export const ExplorerTableActions = {
    updateOrderBy,
    updateOrderDesc,
    updateFilterBy,
    updatePage,
    updateRowsPerPage,
    fetchEntities,
    fetchEntitiesSuccess,
    fetchEntitiesFailure,
};

export const ExplorerToggleBarActions = {
    updateFilterByDrug,
    updateFilterByMedicinalProduct,
    updateFilterByOther,
    toggleFilterByDrug,
    toggleFilterByMedicinalProduct,
    toggleFilterByOther
};

export const EXPLORER_ACTIONS = {
    ...EXPLORER_SEARCH_BAR_ACTIONS,
    ...EXPLORER_TABLE_ACTIONS,
    ...EXPLORER_TOGGLE_BAR_ACTIONS
}

export const ExplorerActions = {
    ...ExplorerSearchBarActions,
    ...ExplorerTableActions,
    ...ExplorerToggleBarActions,
}

export default ExplorerActions;
