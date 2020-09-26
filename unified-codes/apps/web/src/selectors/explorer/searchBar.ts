import { createSelector } from 'reselect';

import { IState, IExplorerSearchBarState } from '../../types';

export const selectSearchBar = (state: IState): IExplorerSearchBarState => state.explorer.searchBar;

export const selectInput = createSelector(
  selectSearchBar,
  (searchBar: IExplorerSearchBarState): string => searchBar?.input
);

export const selectLabel = createSelector(
    selectSearchBar,
    (searchBar: IExplorerSearchBarState): string => searchBar?.label
  );
  

export const SearchBarSelectors = {
    selectInput,
    selectLabel,
};

export default SearchBarSelectors;
