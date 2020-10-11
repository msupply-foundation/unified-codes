import * as React from 'react';
import { connect } from 'react-redux';

import { EntityTable } from '@unified-codes/ui';

import { withStyles } from '../../styles';
import { borderCollapse, IState, ITheme, overflow, position } from '../../types';

import ExplorerTableHeader from './ExplorerTableHeader';
import ExplorerTableRows from './ExplorerTableRows';
import ExplorerTablePagination from './ExplorerTablePagination';

const styles = (theme: ITheme) => ({
  tableContainer: {
    marginTop: 5,
    maxHeight: `calc(100vh - 330px)`,
    overflowY: 'scroll' as overflow,
  },
  table: {
    borderCollapse: 'separate' as borderCollapse,
  },
  paginationContainer: {
    justifyContent: 'flex-end',
    background: theme.palette.background.toolbar,
  },
});

const mapStateToProps = (state: IState) => {
  const header = <ExplorerTableHeader />;
  const rows = <ExplorerTableRows />;
  const pagination = <ExplorerTablePagination />;

  return { header, rows, pagination };
};

export const ExplorerTable = connect(mapStateToProps)(withStyles(styles)(EntityTable));

export default ExplorerTable;
