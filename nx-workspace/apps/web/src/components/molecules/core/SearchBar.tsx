import * as React from "react";
<<<<<<< HEAD:web/src/components/molecules/core/SearchBar.tsx
import {
  Button,
  ClearIcon,
  Grid,
  InputAdornment,
  SearchIcon,
  TextField,
} from "../../atoms";
=======
import { styled } from "@material-ui/core/styles";
import { ClearIcon, Container } from "../../atoms";
import { InputField, SearchButton } from "../../molecules";
import {
  OnChange,
  InputChangeElement,
  OnClick,
  ButtonClickElement,
} from "../../../types";
import { flexStyle, flexRowStyle } from "../../../styles";
>>>>>>> master:nx-workspace/apps/web/src/components/molecules/core/SearchBar.tsx

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
