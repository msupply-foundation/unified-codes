import * as React from "react";

import IconInput from "./IconInput";
import PersonIcon from "../../icons/atoms/PersonIcon";

export interface UsernameInputProps {
  input?: string;
  onChange?: (input: string) => void;
}

export type UsernameInput = React.FunctionComponent<UsernameInputProps>;

export const UsernameInput: UsernameInput = ({ input, onChange }) => {
  const onChangeText = React.useCallback(
    (event) => (onChange ? onChange(event.target.value) : null),
    [onChange]
  );

  return <IconInput icon={PersonIcon} fullWidth label="Username" value={input} onChange={onChangeText}></IconInput>;
}

export default UsernameInput;
  return (
    <IconInput
      icon={PersonIcon}
      fullWidth
      label="Username"
      value={input}
      onChange={onChangeText}
    />
  );
};
