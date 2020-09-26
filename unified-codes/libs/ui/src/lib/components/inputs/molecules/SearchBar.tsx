import * as React from 'react';

import Button from '../atoms/Button';
import ClearInput from './ClearInput';
import Grid from '../../layout/atoms/Grid';
import SearchIcon from '../../icons/atoms/SearchIcon';

export interface SearchBarProps {
  classes: { 
    root: string;
    button: string;
    text: string;
  }
  input: string;
  label?: string;
  onChange?: (input: string) => void;
  onClear?: () => void;
  onSearch?: (input: string) => void;
}

export type SearchBar = React.FunctionComponent<SearchBarProps>;

export const SearchBar: SearchBar = ({ classes, input, label, onChange, onClear, onSearch }) => {
  const onChangeText = React.useCallback(
    (event) => {
      event.preventDefault();
      onChange(event.target.value);
    },
    [onChange]
  );

  const onClick = React.useCallback(() => onSearch && onSearch(input), [input, onSearch]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key == 'Enter') {
      onSearch && onSearch(input);
    }
  };

  return (
    <Grid className={classes?.root} container>
      <Grid item xs={11}>
        <ClearInput
          classes={{ root:classes?.text }}
          fullWidth
          label={label}
          value={input}
          onChange={onChangeText}
          onClear={onClear}
          onKeyDown={handleKeyDown}
        />
      </Grid>
      <Grid item xs={1}>
        <Button classes={{ root: classes?.button }} fullWidth startIcon={<SearchIcon />} onClick={onClick} />
      </Grid>
    </Grid>
  );
};

export default SearchBar;
