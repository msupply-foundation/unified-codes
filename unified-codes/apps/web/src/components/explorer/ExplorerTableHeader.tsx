import * as React from 'react';
import { batch, connect } from 'react-redux';

import { EntityTableHeader } from '@unified-codes/ui';
import { EEntityField } from '@unified-codes/data';

import { ExplorerActions, IExplorerAction } from '../../actions';
import { ExplorerSelectors } from '../../selectors';
import { IState, ITheme } from '../../types';
import { withStyles } from '../../styles';

const styles = (theme: ITheme) => ({
    root: {},
    row: {
        borderBottom: `1px solid ${theme.palette.divider}`,
    },
    cell: {
        background: theme.palette.background.toolbar,
        borderRight: `1px solid ${theme.palette.divider}`,
        fontWeight: 700,
        cursor: 'pointer',
        padding: '3px 16px',
        '&:last-child': { borderRight: 0 },
        '&:first-letter': { textTransform: 'capitalize' }
    },
});

const mapDispatchToProps = (dispatch: React.Dispatch<IExplorerAction>) => {
    const onSort = (column: string) => {
        batch(() => {
            dispatch(ExplorerActions.updateOrderBy(column as EEntityField));
            dispatch(ExplorerActions.updateEntities());
        })
    } 
    return { onSort };
};

const mapStateToProps = (state: IState) => {
    const columns = [EEntityField.CODE, EEntityField.DESCRIPTION, EEntityField.TYPE];

    const orderBy = ExplorerSelectors.selectOrderBy(state);
    const orderDesc = ExplorerSelectors.selectOrderDesc(state);

    return { columns, orderBy, orderDesc };
};

export const ExplorerTableHeader = connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(EntityTableHeader));

export default ExplorerTableHeader;