import * as react from 'react';
import { connect } from 'react-redux';

import { TablePagination } from '@unified-codes/ui';

import { TableActions, ITableAction } from '../../actions/explorer';
import { TableSelectors } from '../../selectors/explorer';
import { IState } from '../../types';

const mapDispatchToProps = (dispatch: React.Dispatch<ITableAction>) => {
    const onChangePage = (_: React.MouseEvent<HTMLButtonElement> | null, page: number) => dispatch(TableActions.updatePage(page));
    const onChangeRowsPerPage = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => dispatch(TableActions.updateRowsPerPage(+event.target.value));
    
    return { onChangePage, onChangeRowsPerPage };
};

const mapStateToProps = (state: IState) => {
    const rowsPerPageOptions = [25, 50, 100];

    const count = TableSelectors.selectCount(state); 
    const rowsPerPage = TableSelectors.selectRowsPerPage(state);
    const page = TableSelectors.selectPage(state);

    return { rowsPerPageOptions, count, rowsPerPage, page };
};

export const ExplorerTablePagination = connect(mapStateToProps, mapDispatchToProps)(TablePagination);

export default ExplorerTablePagination;