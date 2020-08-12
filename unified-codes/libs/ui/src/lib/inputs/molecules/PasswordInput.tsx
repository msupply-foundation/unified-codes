import * as React from 'react';

import IconInput from './IconInput';
import VpnKeyIcon from '../../icons/atoms/VpnKeyIcon';

export interface PasswordInputProps {
  input?: string;
  onChange?: (input: string) => void;
}

export type PasswordInput = React.FunctionComponent<PasswordInputProps>;

export const PasswordInput: PasswordInput = ({ input, onChange }) => {
  const onChangeText = React.useCallback(
    (event) => (onChange ? onChange(event.target.value) : null),
    [onChange]
  );

  return (
    <IconInput
      fullWidth
      icon={VpnKeyIcon}
      label="Password"
      type="password"
      value={input}
      onChange={onChangeText}
    ></IconInput>
  );
};

export default PasswordInput;
