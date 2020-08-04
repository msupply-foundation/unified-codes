import * as React from "react";
import { Button, ClearIcon, SearchIcon } from "../src/components";

export default { title: "Button" };

export const withClearIcon = () => {
  return <Button startIcon={<ClearIcon />} />;
};

export const withSearchIcon = () => {
  return <Button startIcon={<SearchIcon />} />;
};
