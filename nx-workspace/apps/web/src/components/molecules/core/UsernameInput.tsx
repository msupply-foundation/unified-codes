import * as React from "react";

import { PersonIcon } from "../../atoms";
import { IconInput } from "./IconInput";

export interface UsernameInputProps {
    input?: string;
    onChange?: (input: string) => void;
};

export type UsernameInput = React.FunctionComponent<UsernameInputProps>;

export const UsernameInput: UsernameInput = ({ input, onChange }) => {
    const onChangeText = React.useCallback(
        (event) => (onChange ? onChange(event.target.value) : null),
        [onChange]
      );

    return <IconInput icon={PersonIcon} fullWidth label="Username" value={input} onChange={onChangeText} />;
}