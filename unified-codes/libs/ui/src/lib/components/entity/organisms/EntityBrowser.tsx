import * as React from 'react';

import { Entity } from '@unified-codes/data';

import EntityTable from '../molecules/EntityTable';
import Grid from '../../layout/atoms/Grid';
import SearchBar from '../../inputs/molecules/SearchBar';

export interface EntityBrowserProps {
  entities: Entity[];
  onChange: (value: string) => void;
  onClear: () => void;
  onSearch: () => void;
}

export type EntityBrowser = React.FunctionComponent<EntityBrowserProps>;

export const EntityBrowser: EntityBrowser = ({ entities, onChange, onClear, onSearch }) => {
  return (
    <Grid container direction="column">
      <Grid item>
        <SearchBar onChange={onChange} onClear={onClear} onSearch={onSearch} />
      </Grid>
      <Grid item>
        <EntityTable data={entities} />
      </Grid>
    </Grid>
  );
};

export default EntityBrowser;