import * as React from 'react';
import { connect } from 'react-redux';

import {
  TableFooter,
  TableRow,
  TablePagination,
  TablePaginationProps,
} from '@unified-codes/ui/components';

import { ExplorerActions, IExplorerAction } from '../../../actions';
import { ExplorerSelectors } from '../../../selectors';
import { IState } from '../../../types';

export interface ExplorerTablePaginationProps extends Omit<TablePaginationProps, 'classes'> {
  classes?: {
    root?: string;
    pagination?: string;
  };
}

export type ExplorerTablePagination = React.FunctionComponent<ExplorerTablePaginationProps>;

export const ExplorerTablePaginationComponent: ExplorerTablePagination = ({
  classes,
  ...props
}) => (
  <TableFooter classes={{ root: classes?.root }}>
    <TableRow>
      <TablePagination classes={{ root: classes?.pagination }} {...props} />
    </TableRow>
  </TableFooter>
);

const mapDispatchToProps = (dispatch: React.Dispatch<IExplorerAction>) => {
  const onChangePage = (_: React.MouseEvent<HTMLButtonElement> | null, page: number) =>
    dispatch(ExplorerActions.updatePage(page));
  const onChangeRowsPerPage = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) =>
    dispatch(ExplorerActions.updateRowsPerPage(+event.target.value));

  return { onChangePage, onChangeRowsPerPage };
};

const mapStateToProps = (state: IState) => {
  const rowsPerPageOptions = [25, 50, 100];

  const count = ExplorerSelectors.selectCount(state);
  const rowsPerPage = ExplorerSelectors.selectRowsPerPage(state);
  const page = ExplorerSelectors.selectPage(state);

  return { rowsPerPageOptions, count, rowsPerPage, page };
};

export const ExplorerTablePagination = connect(
  mapStateToProps,
  mapDispatchToProps
)(ExplorerTablePaginationComponent);

export default ExplorerTablePagination;
