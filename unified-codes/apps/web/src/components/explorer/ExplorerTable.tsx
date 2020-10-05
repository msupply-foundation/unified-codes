import * as React from 'react';
import { connect } from 'react-redux';

import { EntityTable } from '@unified-codes/ui';

import { withStyles } from '../../styles';
import { IState, ITheme, overflow } from '../../types';

import ExplorerTableHeader from './ExplorerTableHeader';
import ExplorerTableRows from './ExplorerTableRows';
import ExplorerTablePagination from './ExplorerTablePagination';

const styles = (theme: ITheme) => ({
    tableContainer: {
        marginTop: 5,
        maxHeight: `calc(100vh - $370px)`,
        overflowY: 'scroll' as overflow,
    },
    paginationContainer: {
        justifyContent: 'flex-end',
        background: theme.palette.background.toolbar,
    }
});

const mapStateToProps = (state: IState) => {
    const header = <ExplorerTableHeader />;
    const rows = <ExplorerTableRows />;
    const pagination = <ExplorerTablePagination />;

    return { header, rows, pagination };
}

export const ExplorerTable = connect(mapStateToProps)(withStyles(styles)(EntityTable));

export default ExplorerTable;