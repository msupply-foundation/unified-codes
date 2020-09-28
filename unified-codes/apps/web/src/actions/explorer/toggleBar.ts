import { Action } from 'redux';

export const TOGGLE_BAR_ACTIONS = {
  UPDATE_FILTER_BY_DRUG: 'explorer/toggleBar/updateFilterByDrug',
  UPDATE_FILTER_BY_MEDICINAL_PRODUCT: 'explorer/toggleBar/updateFilterByUnitOfUse',
  UPDATE_FILTER_BY_OTHER: 'explorer/toggleBar/updateFilterByOther',
  TOGGLE_FILTER_BY_DRUG: 'explorer/toggleBar/toggleFilterByDrug',
  TOGGLE_FILTER_BY_MEDICINAL_PRODUCT: 'explorer/toggleBar/toggleFilterByMedicinalProduct',
  TOGGLE_FILTER_BY_OTHER: 'explorer/toggleBar/toggleFilterByOther',
};

export interface IToggleBarUpdateFilterByDrugAction extends Action<string> {
    filterByDrug: boolean;
}

export interface IToggleBarUpdateFilterByUnitOfUseAction extends Action<string> {
    filterByUnitOfUse: boolean;
}

export interface IToggleBarUpdateFilterByOtherAction extends Action<string> {
    filterByOther: boolean;
}

export interface IToggleBarToggleByDrugAction extends Action<string> {}

export interface IToggleBarToggleByUnitOfUseAction extends Action<string> {}

export interface IToggleBarToggleByOtherAction extends Action<string> {}

export type IToggleBarAction = 
    IToggleBarUpdateFilterByDrugAction | 
    IToggleBarUpdateFilterByUnitOfUseAction |
    IToggleBarUpdateFilterByOtherAction |
    IToggleBarToggleByDrugAction |
    IToggleBarToggleByUnitOfUseAction |
    IToggleBarToggleByOtherAction;

const updateFilterByDrug = (filterByDrug: boolean) => ({
  type: TOGGLE_BAR_ACTIONS.UPDATE_FILTER_BY_DRUG,
  filterByDrug,
});

const updateFilterByMedicinalProduct = (filterByMedicinalProduct: boolean) => ({
    type: TOGGLE_BAR_ACTIONS.UPDATE_FILTER_BY_MEDICINAL_PRODUCT,
    filterByMedicinalProduct,
});

const updateFilterByOther = (filterByOther: boolean) => ({
    type: TOGGLE_BAR_ACTIONS.UPDATE_FILTER_BY_OTHER,
    filterByOther,
});

const toggleFilterByDrug = () => ({
    type: TOGGLE_BAR_ACTIONS.TOGGLE_FILTER_BY_DRUG,
});
  
const toggleFilterByMedicinalProduct = () => ({
    type: TOGGLE_BAR_ACTIONS.TOGGLE_FILTER_BY_MEDICINAL_PRODUCT,
});
  
const toggleFilterByOther = () => ({
    type: TOGGLE_BAR_ACTIONS.TOGGLE_FILTER_BY_OTHER,
});


export const toggleBarActions = {
    updateFilterByDrug,
    updateFilterByMedicinalProduct,
    updateFilterByOther,
    toggleFilterByDrug,
    toggleFilterByMedicinalProduct,
    toggleFilterByOther
};

export default toggleBarActions;
