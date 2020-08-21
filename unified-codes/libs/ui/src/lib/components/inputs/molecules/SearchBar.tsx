import * as React from 'react';

import ClearInput from './ClearInput';
import Grid from '../../layout/atoms/Grid';
import SearchButton from './SearchButton';

export interface SearchBarProps {
  input: string;
  onChange?: (input: string) => void;
  onClear?: () => void;
  onSearch?: (input: string) => void;
}

export type SearchBar = React.FunctionComponent<SearchBarProps>;

export const SearchBar: SearchBar = ({ input, onChange, onClear, onSearch }) => {
  const onChangeText = React.useCallback(
    (event) => (onChange ? onChange(event.target.value) : null),
    [onChange]
  );

  const onClick = React.useCallback(() => onSearch && onSearch(input), [input, onSearch]);

  return (
    <Grid container>
      <Grid item xs={11}>
        <ClearInput fullWidth value={input} onChange={onChangeText} onClear={onClear}/>
      </Grid>
      <Grid item xs={1}>
        <SearchButton fullWidth onClick={onClick} />
      </Grid>
    </Grid>
  );
};

export default SearchBar;
