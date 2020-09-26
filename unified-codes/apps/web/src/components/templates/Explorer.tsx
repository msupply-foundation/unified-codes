import * as React from 'react';

import { EntityBrowser } from '@unified-codes/ui';

import ExplorerTable from '../molecules/ExplorerTable';
import ExplorerToggleBar from '../molecules/ExplorerToggleBar';
import ExplorerSearchBar from '../molecules/ExplorerSearchBar';

export interface ExplorerProps {}

export type Explorer = React.FunctionComponent<ExplorerProps>;

export const Explorer: Explorer = () => (
  <EntityBrowser 
    table={<ExplorerTable/>}
    toggleBar={<ExplorerToggleBar/>}
    searchBar={<ExplorerSearchBar/>}        
  />
);

export default Explorer;