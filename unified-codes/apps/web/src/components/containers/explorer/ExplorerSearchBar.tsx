import * as React from 'react';
import { batch, connect } from 'react-redux';

import { SearchBar } from '@unified-codes/ui/components';
import { withStyles } from '@unified-codes/ui/styles';

import { ExplorerActions, IExplorerAction } from '../../../actions';
import { ExplorerSelectors } from '../../../selectors';
import { IState } from '../../../types';
import { ITheme } from '../../../styles';

const styles = (_: ITheme) => ({
  input: { paddingLeft: 15 },
  button: { marginTop: 15 },
});

const mapDispatchToProps = (dispatch: React.Dispatch<IExplorerAction>) => {
  const onChange = (input: string) => dispatch(ExplorerActions.updateInput(input));

  const onClear = () =>
    batch(() => {
      dispatch(ExplorerActions.resetPage());
      dispatch(ExplorerActions.resetInput());
      dispatch(ExplorerActions.resetFilterBy());
      dispatch(ExplorerActions.updateEntities());
    });

  const onSearch = () => {
    dispatch(ExplorerActions.resetPage());
    dispatch(ExplorerActions.updateEntities());
  };

  return { onChange, onClear, onSearch };
};

const mapStateToProps = (state: IState) => {
  const input = ExplorerSelectors.selectInput(state);
  const label = ExplorerSelectors.selectLabel(state);

  return { input, label };
};

export const ExplorerSearchBar = connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(SearchBar));

export default ExplorerSearchBar;
