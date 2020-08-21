import * as React from 'react';

import ClearInput, { ClearInputProps } from './ClearInput';
import Grid from '../../layout/atoms/Grid';
import SearchButton from './SearchButton';

export interface SearchBarProps {
  input?: string;
  onChange?: (input: string) => void;
  onClear?: () => void;
  onSearch?: () => void;
}

export type SearchBar = React.FunctionComponent<SearchBarProps>;

export const SearchBar: SearchBar = ({ input, onChange, onClear, onSearch }) => {
  const onChangeText = React.useCallback(
    (event) => (onChange ? onChange(event.target.value) : null),
    [onChange]
  );

  const SearchInput = input 
    ? (props: ClearInputProps) => <ClearInput {...props} value={input} onChange={onChangeText} onClear={onClear} />
    : (props: ClearInputProps) =>  <ClearInput {...props} />

  return (
    <Grid container>
      <Grid item xs={11}>
        <SearchInput fullWidth onChange={onChangeText} onClear={onClear}/>
      </Grid>
      <Grid item xs={1}>
        <SearchButton fullWidth onClick={onSearch} />
      </Grid>
    </Grid>
  );
};

export default SearchBar;
