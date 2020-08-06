import * as React from "react";
import { SearchBar } from "../src/components";

export default { title: "SearchBar" };

export const withNoProps = () => {
  const returnVoid = () => null;
  return (
    <SearchBar
      onChange={returnVoid}
      onClear={returnVoid}
      onSearch={returnVoid}
    />
  );
};

export const withControlProps = () => {
  const [input, setInput] = React.useState("");

  const updateInput = React.useCallback((value) => setInput(value), []);
  const resetInput = React.useCallback(() => setInput(""), []);
  const alertInput = React.useCallback(() => alert(input), [input]);

  return (
    <SearchBar
      input={input}
      onChange={updateInput}
      onClear={resetInput}
      onSearch={alertInput}
    />
  );
};
