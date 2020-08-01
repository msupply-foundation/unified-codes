import * as React from "react";
import {
  Button,
  ClearIcon,
  Grid,
  InputAdornment,
  SearchIcon,
  TextField,
} from "../../atoms";

export interface SearchBarProps {
  input?: string;
  onChange?: (input: string) => void;
  onClear?: () => void;
  onSearch?: () => void;
}

export type SearchBar = React.FunctionComponent<SearchBarProps>;

export const SearchBar: SearchBar = ({
  input,
  onChange,
  onClear,
  onSearch,
}) => {
  const onChangeText = React.useCallback(
    (event) => (onChange ? onChange(event.target.value) : null),
    [onChange]
  );

  return (
    <Grid container>
      <Grid item xs={11}>
        <TextField
          fullWidth
          value={input}
          onChange={onChangeText}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Button startIcon={<ClearIcon />} onClick={onClear} />
              </InputAdornment>
            ),
          }}
        />
      </Grid>
      <Grid item xs={1}>
        <Button fullWidth startIcon={<SearchIcon />} onClick={onSearch} />
      </Grid>
    </Grid>
  );
};
