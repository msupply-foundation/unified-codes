import * as React from "react";
import { Grid } from "../../atoms";
import { SearchBar, EntityTable } from "../../molecules";
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

  return (
    <Grid container direction="column">
      <Grid item>
        <SearchBar
          input={input}
          onChange={onChange}
          onClear={onClear}
          onSearch={onSearch}
        />
      </Grid>
      <Grid item>
        <EntityTable data={data}/>
      </Grid>
    </Grid>
  );
};