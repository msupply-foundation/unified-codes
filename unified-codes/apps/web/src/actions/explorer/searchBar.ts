import { Action } from 'redux';

export const SEARCH_BAR_ACTIONS = {
  UPDATE_INPUT: 'explorer/searchBar/updateInput',
  UPDATE_LABEL: 'explorer/searchBar/updateLabel',
};

export interface ISearchBarUpdateInputAction extends Action<string> {
  input: string;
}

export interface ISearchBarUpdateLabelAction extends Action<string> {
  label: string;
}

export type ISearchBarAction = ISearchBarUpdateInputAction | ISearchBarUpdateLabelAction;

const updateInput = (input: string) => ({
  type: SEARCH_BAR_ACTIONS.UPDATE_INPUT,
  input,
});

const updateLabel = (label: string) => ({
    type: SEARCH_BAR_ACTIONS.UPDATE_LABEL,
    label,
});

export const SearchBarActions = {
  updateInput,
  updateLabel
};

export default SearchBarActions;
