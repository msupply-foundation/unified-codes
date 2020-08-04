import * as React from "react";

import { KeyIcon } from "../../atoms";
import { IconInput } from "./IconInput";

export interface PasswordInputProps {
    input?: string;
    onChange?: (input: string) => void;
};

export type PasswordInput = React.FunctionComponent<PasswordInputProps>;

export const PasswordInput: PasswordInput = ({ input, onChange }) => {
    const onChangeText = React.useCallback(
        (event) => (onChange ? onChange(event.target.value) : null),
        [onChange]
      );

    return <IconInput icon={KeyIcon} fullWidth label="Password" type="password" value={input} onChange={onChangeText} />;
}