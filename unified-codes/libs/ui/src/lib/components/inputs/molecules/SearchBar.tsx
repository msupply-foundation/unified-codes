import * as React from 'react';

import ClearInput from './ClearInput';
import Grid from '../../layout/atoms/Grid';
import SearchButton from './SearchButton';

export interface SearchBarProps {
  input: string;
  label?: string;
  onChange?: (input: string) => void;
  onClear?: () => void;
  onSearch?: (input: string) => void;
}

export type SearchBar = React.FunctionComponent<SearchBarProps>;

export const SearchBar: SearchBar = ({ input, label, onChange, onClear, onSearch }) => {
  const onChangeText = React.useCallback(
    (event) => (onChange ? onChange(event.target.value) : null),
    [onChange]
  );

  const onClick = React.useCallback(() => onSearch && onSearch(input), [input, onSearch]);

  return (
    <Grid container>
      <Grid item xs={11}>
        <ClearInput
          fullWidth
          label={label}
          value={input}
          onChange={onChangeText}
          onClear={onClear}
        />
      </Grid>
      <Grid item xs={1}>
        <SearchButton fullWidth onClick={onClick} style={{ marginTop: 15 }} />
      </Grid>
    </Grid>
  );
};

export default SearchBar;
