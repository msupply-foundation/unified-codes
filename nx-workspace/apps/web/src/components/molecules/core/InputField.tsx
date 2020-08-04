import * as React from "react";
import { styled } from "@material-ui/core/styles";
import { Input, Button, ClearIcon, SearchIcon, Container } from "../../atoms";
import { flexStyle, flexRowStyle } from "../../../styles";
import {
  OnChange,
  OnClick,
  InputChangeElement,
  ButtonClickElement,
} from "../../../types";

export interface InputFieldProps {
  input?: string;
  icon: ClearIcon | SearchIcon;
  onChange?: OnChange<InputChangeElement>;
  onClick?: OnClick<ButtonClickElement>;
  className?: string;
}

export type InputField = React.FunctionComponent<InputFieldProps>;

export const InputField: InputField = ({
  input,
  icon,
  onChange,
  onClick,
  ...other
}) => {
  const FlexContainer = React.useMemo(
    () =>
      styled(({ ...props }) => <Container {...props} />)(styles.flexContainer),
    []
  );
  const FlexInput = React.useMemo(
    () => styled(({ ...props }) => <Input {...props} />)(styles.flexInput),
    []
  );
  const FlexButton = React.useMemo(
    () => styled(({ ...props }) => <Button {...props} />)(styles.flexButton),
    []
  );
  const ButtonIcon = React.useMemo(() => icon, [icon]);

  return (
    <FlexContainer {...other}>
      <FlexInput disableUnderline value={input} onChange={onChange} />
      <FlexButton startIcon={<ButtonIcon />} onClick={onClick} />
    </FlexContainer>
  );
};

const styles = {
  flexContainer: flexRowStyle,
  flexInput: { ...flexStyle, flexGrow: 95 },
  flexButton: { ...flexStyle, flexGrow: 5 },
};

export default InputField;
