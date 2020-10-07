import * as React from 'react';
import { connect } from 'react-redux';

import { TablePagination } from '@unified-codes/ui';

import { ExplorerActions, IExplorerAction } from '../../actions';
import { ExplorerSelectors } from '../../selectors';
import { IState, ITheme, position } from '../../types';
import { withStyles } from '../../styles';

const styles = (theme: ITheme) => ({
    root: { background: theme.palette.background.toolbar, bottom: 0, position: 'sticky' as position }
});

const mapDispatchToProps = (dispatch: React.Dispatch<IExplorerAction>) => {
    const onChangePage = (_: React.MouseEvent<HTMLButtonElement> | null, page: number) => dispatch(ExplorerActions.updatePage(page));
    const onChangeRowsPerPage = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => dispatch(ExplorerActions.updateRowsPerPage(+event.target.value));
    
    return { onChangePage, onChangeRowsPerPage };
};

const mapStateToProps = (state: IState) => {
    const rowsPerPageOptions = [25, 50, 100];

    const count = ExplorerSelectors.selectCount(state); 
    const rowsPerPage = ExplorerSelectors.selectRowsPerPage(state);
    const page = ExplorerSelectors.selectPage(state);

    return { rowsPerPageOptions, count, rowsPerPage, page };
};

export const ExplorerTablePagination = connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(TablePagination));

export default ExplorerTablePagination;