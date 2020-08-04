import * as React from "react";
import { ClearIcon, SearchIcon, InputField } from "../src/components";

export default { title: "InputField" };

export const withCancelIcon = () => <InputField icon={ClearIcon} />;
export const withSearchIcon = () => <InputField icon={SearchIcon} />;
