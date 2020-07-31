
import * as React from "react";
import { styled } from "@material-ui/core/styles";
import { Button, ClearIcon, Container, InputAdornment, SearchIcon, TextField } from "../../atoms";
import {
  OnChange,
  InputChangeElement,
  OnClick,
  ButtonClickElement,
} from "../../../types";
import { flexStyle, flexRowStyle } from "../../../styles";

export interface SearchBarProps {
  input?: string;
  onChange?: OnChange<InputChangeElement>;
  onClear?: OnClick<ButtonClickElement>;
  onSearch?: OnClick<ButtonClickElement>;
}

export type SearchBar = React.FunctionComponent<SearchBarProps>;

export const SearchBar: SearchBar = ({
  input,
  onChange,
  onClear,
  onSearch,
  ...other
}) => {
  const FlexContainer = React.useMemo(
    () =>
      styled(({ ...props }) => <Container {...props} />)(styles.flexContainer),
    []
  );
  const FlexTextField = React.useMemo(
    () =>
    styled(({ ...props }) => <TextField {...props} />)(
      styles.flexTextField
    ),
  []
  )
  const FlexSearchButton = React.useMemo(
    () =>
      styled(({ ...props }) => <Button startIcon={<SearchIcon/>} {...props} />)(
        styles.flexSearchButton
      ),
    []
  );

  return (
    <FlexContainer {...other}>
      <FlexTextField
        value={input}
  InputProps={{ endAdornment: <InputAdornment position="end"><Button startIcon={<ClearIcon/>} onClick={onClear}/></InputAdornment>}}
      />
      <FlexSearchButton onClick={onSearch} />
    </FlexContainer>
  );
};

const styles = {
  flexContainer: flexRowStyle,
  flexTextField: { ...flexStyle, flexGrow: 95 },
  flexSearchButton: { ...flexStyle, flexGrow: 5 },
};
