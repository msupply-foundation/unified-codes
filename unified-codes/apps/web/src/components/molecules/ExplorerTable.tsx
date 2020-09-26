import * as React from 'react';

import { EntityTable } from '@unified-codes/ui';

import ExplorerTableHeader from './ExplorerTableHeader';
import ExplorerTableRows from './ExplorerTableRows';
import ExplorerTablePagination from './ExplorerTablePagination';

export const ExplorerTable = () => <EntityTable header={<ExplorerTableHeader/>} rows={<ExplorerTableRows/>} pagination={<ExplorerTablePagination/>}/>

export default ExplorerTable;