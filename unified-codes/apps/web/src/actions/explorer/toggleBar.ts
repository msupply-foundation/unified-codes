import { Action } from 'redux';

export const TOGGLE_BAR_ACTIONS = {
  UPDATE_FILTER_BY_DRUG: 'explorer/toggleBar/updateFilterByDrug',
  UPDATE_FILTER_BY_UNIT_OF_USE: 'explorer/toggleBar/updateFilterByUnitOfUse',
  UPDATE_FILTER_BY_OTHER: 'explorer/toggleBar/updateFilterByOther',
  TOGGLE_FILTER_BY_DRUG: 'explorer/toggleBar/toggleFilterByDrug',
  TOGGLE_FILTER_BY_UNIT_OF_USE: 'explorer/toggleBar/updateFilterByUnitOfUse',
  TOGGLE_FILTER_BY_OTHER: 'explorer/toggleBar/updateFilterByOther',
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

const updateFilterByUnitOfUse = (filterByUnitOfUse: boolean) => ({
    type: TOGGLE_BAR_ACTIONS.UPDATE_FILTER_BY_UNIT_OF_USE,
    filterByUnitOfUse,
});

const updateFilterByOther = (filterByOther: boolean) => ({
    type: TOGGLE_BAR_ACTIONS.UPDATE_FILTER_BY_OTHER,
    filterByOther,
});

const toggleFilterByDrug = () => ({
    type: TOGGLE_BAR_ACTIONS.UPDATE_FILTER_BY_DRUG,
});
  
const toggleFilterByUnitOfUse = () => ({
    type: TOGGLE_BAR_ACTIONS.UPDATE_FILTER_BY_UNIT_OF_USE,
});
  
const toggleFilterByOther = () => ({
    type: TOGGLE_BAR_ACTIONS.UPDATE_FILTER_BY_OTHER,
});


export const toggleBarActions = {
    updateFilterByDrug,
    updateFilterByUnitOfUse,
    updateFilterByOther,
    toggleFilterByDrug,
    toggleFilterByUnitOfUse,
    toggleFilterByOther
};

export default toggleBarActions;
