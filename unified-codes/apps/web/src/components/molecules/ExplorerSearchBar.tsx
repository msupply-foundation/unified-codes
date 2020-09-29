import * as React from 'react';
import { connect } from 'react-redux';

import { SearchBar } from '@unified-codes/ui';

import { ExplorerActions, IExplorerAction } from '../../actions';
import { ExplorerSelectors } from '../../selectors';
import { IState } from '../../types';

const mapDispatchToProps = (dispatch: React.Dispatch<IExplorerAction>) => {
    const onChange = (input: string) => dispatch(ExplorerActions.updateInput(input));
    const onClear = () => {
        dispatch(ExplorerActions.updateInput(''));
        dispatch(ExplorerActions.updateFilterBy(''));
    }
    const onSearch = () => dispatch(ExplorerActions.fetchEntities());
    return { onChange, onClear, onSearch };
};

const mapStateToProps = (state: IState) => {
    const input = ExplorerSelectors.selectInput(state);
    const label = ExplorerSelectors.selectLabel(state);
    return { input, label };
};

export const ExplorerSearchBar = connect(mapStateToProps, mapDispatchToProps)(SearchBar);

export default ExplorerSearchBar;