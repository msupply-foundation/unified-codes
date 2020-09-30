import * as React from 'react';

import ExplorerBrowser from './ExplorerBrowser';
import ExplorerTable from './ExplorerTable';
import ExplorerTableHeader from './ExplorerTableHeader';
import ExplorerTableRows from './ExplorerTableRows';
import ExplorerTablePagination from './ExplorerTablePagination';
import ExplorerToggleBar from './ExplorerToggleBar';
import ExplorerSearchBar from './ExplorerSearchBar';

export const Explorer = () => {
  const header = <ExplorerTableHeader />;
  const rows = <ExplorerTableRows />;
  const pagination = <ExplorerTablePagination />;

  const table = <ExplorerTable header={header} rows={rows} pagination={pagination}/>;
  const toggleBar = <ExplorerToggleBar/>;
  const searchBar = <ExplorerSearchBar/>;

  return (
    <ExplorerBrowser
      table={table}
      toggleBar={toggleBar}
      searchBar={searchBar}
    />
  );
}

export default Explorer;