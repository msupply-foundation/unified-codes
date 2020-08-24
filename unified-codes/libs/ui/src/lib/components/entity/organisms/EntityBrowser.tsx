import * as React from 'react';

import { Entity } from '@unified-codes/data';

import EntityTable from '../molecules/EntityTable';
import Grid from '../../layout/atoms/Grid';
import SearchBar from '../../inputs/molecules/SearchBar';

export interface EntityBrowserProps {
  entities: Entity[];
  onChange?: (value: string) => void;
  onClear?: () => void;
  onSearch?: (value: string) => void;
}

export type EntityBrowser = React.FunctionComponent<EntityBrowserProps>;

export const EntityBrowser: EntityBrowser = ({ entities, onChange, onClear, onSearch }) => {
  const [input, setInput] = React.useState('');

  const onChangeInput = React.useCallback(
    (input: string) => {
      setInput(input);
      onChange && onChange(input);
    },
    [setInput]
  );

  return (
    <Grid container direction="column">
      <Grid item>
        <SearchBar input={input} onChange={onChangeInput} onClear={onClear} onSearch={onSearch} />
      </Grid>
      <Grid item>
        <EntityTable data={entities} />
      </Grid>
    </Grid>
  );
};

export default EntityBrowser;
