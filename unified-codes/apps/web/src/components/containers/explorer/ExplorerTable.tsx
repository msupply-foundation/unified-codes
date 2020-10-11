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
    }
});

const mapStateToProps = (_: IState) => {}

export const ExplorerTableComponent = () => (
    <ExplorerTableLayout header={<ExplorerTableHeader/>} rows={<ExplorerTableRows/>} pagination={<ExplorerTablePagination/>} />
);

export const ExplorerTable = connect(mapStateToProps)(withStyles(styles)(ExplorerTableComponent));

export default ExplorerTable;