
import * as React from "react";
import { styled } from "@material-ui/core/styles";
import { Button, ClearIcon, Container, InputAdornment, SearchIcon, TextField } from "../../atoms";
import { flexStyle, flexRowStyle } from "../../../styles";

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

  const onChangeText = React.useCallback(event => onChange ? onChange(event.target.value) : null, [onChange]);

  return (
    <FlexContainer {...other}>
      <FlexTextField
        value={input}
        onChange={onChangeText}
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
