import * as React from 'react';

import ExplorerEntityBrowser from '../molecules/ExplorerEntityBrowser';
import ExplorerTable from '../molecules/ExplorerTable';
import ExplorerToggleBar from '../molecules/ExplorerToggleBar';
import ExplorerSearchBar from '../molecules/ExplorerSearchBar';

export const Explorer = () => (
 <ExplorerEntityBrowser
    table={<ExplorerTable />}
    toggleBar={<ExplorerToggleBar />}
    searchBar={<ExplorerSearchBar />}
  />
);

export default Explorer;