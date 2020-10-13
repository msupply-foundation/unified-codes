import * as React from 'react';
import { connect } from 'react-redux';

import { BorderCollapse, Overflow, withStyles } from '@unified-codes/ui/styles';

import ExplorerTableHeader from './ExplorerTableHeader';
import ExplorerTableRows from './ExplorerTableRows';
import ExplorerTablePagination from './ExplorerTablePagination';
import ExplorerTableLayout from '../../layout/ExplorerTableLayout';

import { IState } from '../../../types';
import { ITheme } from '../../../styles';

const styles = (theme: ITheme) => ({
  tableRows: {
    display: 'block',
    marginTop: 5,
    maxHeight: `calc(100vh - 410px)`,
    overflowY: 'scroll' as Overflow,
  },
  table: {
    borderCollapse: 'separate' as BorderCollapse,
  },
  pagination: {
    justifyContent: 'flex-end',
    background: theme.palette.background.toolbar,
  },
});

export interface ExplorerTableProps {
  classes?: {
    pagination?: string;
    table?: string;
    tableContainer?: string;
    tableRows?: string;
  };
}

export type ExplorerTable = React.FunctionComponent<ExplorerTableProps>;

export const ExplorerTableComponent: ExplorerTable = ({ classes }) => (
  <ExplorerTableLayout
    classes={classes}
    header={<ExplorerTableHeader />}
    rows={<ExplorerTableRows classes={{ root: classes?.tableRows }} />}
    pagination={<ExplorerTablePagination classes={{ root: classes?.pagination }} />}
  />
);

const mapStateToProps = (_: IState) => ({});

export const ExplorerTable = connect(mapStateToProps)(withStyles(styles)(ExplorerTableComponent));

export default ExplorerTable;
