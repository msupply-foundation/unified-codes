import * as React from 'react';
import { connect } from 'react-redux';

import { SearchBar } from '@unified-codes/ui';

import { SearchBarActions, TableActions, ITableAction, ISearchBarAction } from '../../actions/explorer';
import { SearchBarSelectors } from '../../selectors/explorer';
import { IState } from '../../types';

const mapDispatchToProps = (dispatch: React.Dispatch<ISearchBarAction | ITableAction>) => {
    const onChange = (input: string) => dispatch(SearchBarActions.updateInput(input));
    const onClear = () => {
        dispatch(SearchBarActions.updateInput(''));
        dispatch(TableActions.updateFilterBy(''));
    }
    const onSearch = () => dispatch(TableActions.updateData());
    return { onChange, onClear, onSearch };
};

const mapStateToProps = (state: IState) => {
    const input = SearchBarSelectors.selectInput(state);
    const label = SearchBarSelectors.selectLabel(state);
    return { input, label };
};

export const ExplorerSearchBar = connect(mapStateToProps, mapDispatchToProps)(SearchBar);

export default ExplorerSearchBar;