import * as React from 'react';

import { EntityTable } from '@unified-codes/ui';

import { withStyles } from '../../styles';
import { ITheme, overflow } from '../../types';

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

export const ExplorerEntityTable = withStyles(styles)(EntityTable);

export default ExplorerEntityTable;