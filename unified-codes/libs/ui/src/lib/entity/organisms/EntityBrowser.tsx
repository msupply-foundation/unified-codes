import * as React from "react";

import { Entity } from "@unified-codes/util";

import EntityTable from "../molecules/EntityTable";
import Grid from "../../layout/atoms/Grid";
import SearchBar from "../../inputs/molecules/SearchBar";

export interface EntityBrowserProps {
  entities: Entity[];
}

export type EntityBrowser = React.FunctionComponent<EntityBrowserProps>;

export const EntityBrowser: EntityBrowser = ({ entities }) => {
  const [input, setInput] = React.useState("");
  const [data, setData] = React.useState(entities);

  const resetInput = React.useCallback(() => setInput(""), []);
  const resetData = React.useCallback(() => setData(entities), [entities]);

  const onChange = React.useCallback((value) => setInput(value), []);
  const onClear = React.useCallback(() => {
    resetInput();
    resetData();
  }, [resetData, resetInput]);

  const onSearch = React.useCallback(() => {
    setData(entities.filter((entity) => entity.matchesCode(input) || entity.matchesDescription(input)));
  }, [entities, input]);

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
        <EntityTable data={data} />
      </Grid>
    </Grid>
  );
};

export default EntityBrowser;
