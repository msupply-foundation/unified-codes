import * as React from 'react';
import { batch, connect } from 'react-redux';

import { SearchBar } from '@unified-codes/ui/components';
import { makeStyles, createStyles } from '@unified-codes/ui/styles';

import { ExplorerActions, IExplorerAction } from '../../../actions';
import { ExplorerSelectors } from '../../../selectors';
import { IState } from '../../../types';
import { ITheme } from '../../../styles';

const useStyles = makeStyles((theme: ITheme) =>
  createStyles({
    root: { color: theme.palette.text.primary },
    input: { paddingLeft: 15 },
    button: { marginTop: 15 },
  })
);

export interface ExplorerSearchBarProps {
  helperText?: string;
  input?: string;
  label?: string;
  placeholder?: string;
  onChange: () => void;
  onClear: () => void;
  onSearch: () => void;
}

export type ExplorerSearchBarType = React.FunctionComponent<ExplorerSearchBarProps>;

export const ExplorerSearchBarComponent: ExplorerSearchBarType = ({
  helperText,
  input,
  label,
  placeholder,
  onChange,
  onClear,
  onSearch,
}) => {
  const classes = useStyles();
  return (
    <SearchBar
      classes={classes}
      input={input}
      label={label}
      placeholder={placeholder}
      helperText={helperText}
      onChange={onChange}
      onClear={onClear}
      onSearch={onSearch}
    />
  );
};

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
  const placeholder = ExplorerSelectors.selectPlaceholder(state);

  return { input, label, placeholder };
};

export const ExplorerSearchBar = connect(
  mapStateToProps,
  mapDispatchToProps
)(ExplorerSearchBarComponent);

export default ExplorerSearchBar;
