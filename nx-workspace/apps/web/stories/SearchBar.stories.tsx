import * as React from "react";
import { SearchBar } from "../src/components";
<<<<<<< HEAD:web/stories/SearchBar.stories.tsx
=======
import {
  InputChangeElement,
  OnChange,
  OnClick,
  ButtonClickElement,
} from "../src/types";
>>>>>>> master:nx-workspace/apps/web/stories/SearchBar.stories.tsx

export default { title: "SearchBar" };

export const withNoProps = () => {
  return <SearchBar />;
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
