import * as React from "react";
import { styled } from "@material-ui/core/styles";

import { Container } from "../../atoms";
import { SearchBar, EntityTable } from "../../molecules";

import { flexColumnStyle } from "../../../styles";

import { Entity } from "../../../types";

export interface EntityBrowserProps {
  entities: Entity[];
}

export type EntityBrowser = React.FunctionComponent<EntityBrowserProps>;

export const EntityBrowser: EntityBrowser = ({ entities }) => {
  const [input, setInput] = React.useState("");
  const [data, setData] = React.useState(entities);

  const resetInput = React.useCallback(() => setInput(""), []);
  const resetData = React.useCallback(() => setData(entities), []);

  const onChange = React.useCallback(value => setInput(value), []);
  const onClear = React.useCallback(() => {
    resetInput();
    resetData();
  }, []);
  const onSearch = React.useCallback(() => {
    setData(entities.filter((entity) => entity.matches(input)));
  }, [input]);

  const FlexContainer = React.useMemo(
    () =>
      styled(({ ...props }) => <Container {...props} />)(styles.flexContainer),
    []
  );

  return (
    <FlexContainer>
      <SearchBar
        input={input}
        onChange={onChange}
        onClear={onClear}
        onSearch={onSearch}
      />
      <EntityTable data={data} />
    </FlexContainer>
  );
};

const styles = {
  flexContainer: flexColumnStyle,
};
