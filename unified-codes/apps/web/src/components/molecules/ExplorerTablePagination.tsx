import * as react from 'react';
import { connect } from 'react-redux';

import { TablePagination } from '@unified-codes/ui';

import { ExplorerActions, IExplorerAction } from '../../actions';
import { ExplorerSelectors } from '../../selectors';
import { IState } from '../../types';

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

export const ExplorerTablePagination = connect(mapStateToProps, mapDispatchToProps)(TablePagination);

export default ExplorerTablePagination;