import * as React from 'react';
import { connect } from 'react-redux';

import { BorderCollapse, makeStyles, createStyles, Overflow } from '@unified-codes/ui/styles';

import ExplorerTableHeader from './ExplorerTableHeader';
import ExplorerTableRows from './ExplorerTableRows';
import ExplorerTablePagination from './ExplorerTablePagination';
import ExplorerTableLayout from '../../layout/ExplorerTableLayout';

import { IState } from '../../../types';
import { ITheme } from '../../../styles';

const useStyles = makeStyles((theme: ITheme) =>
  createStyles({
    tableContainer: {
      marginTop: 5,
      maxHeight: `calc(100vh - 370px)`,
      overflowY: 'scroll' as Overflow,
    },
    table: {
      borderCollapse: 'separate' as BorderCollapse,
    },
    paginationContainer: {
      justifyContent: 'flex-end',
      background: theme.palette.background.toolbar,
    },
  })
);

const mapStateToProps = (_: IState) => ({});

export const ExplorerTableComponent = () => {
  const classes = useStyles();
  return (
    <ExplorerTableLayout
      classes={classes}
      header={<ExplorerTableHeader />}
      rows={<ExplorerTableRows />}
      pagination={<ExplorerTablePagination />}
    />
  );
};

export const ExplorerTable = connect(mapStateToProps)(ExplorerTableComponent);

export default ExplorerTable;
