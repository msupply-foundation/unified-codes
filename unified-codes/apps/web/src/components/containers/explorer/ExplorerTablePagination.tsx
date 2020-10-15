import * as React from 'react';
import { batch, connect } from 'react-redux';

import {
  TableFooter,
  TableRow,
  TablePagination,
  TablePaginationProps,
} from '@unified-codes/ui/components';

import { ExplorerActions, IExplorerAction } from '../../../actions';
import { ExplorerSelectors } from '../../../selectors';
import { IExplorerParameters, IState } from '../../../types';

export interface ExplorerTablePaginationProps
  extends Omit<TablePaginationProps, 'classes' | 'onChangePage' | 'onChangeRowsPerPage'> {
  classes?: {
    root?: string;
    pagination?: string;
  };
  onChangePage?: (page: number, parameters?: IExplorerParameters) => void;
  onChangeRowsPerPage?: (rowsPerPage: number, parameters?: IExplorerParameters) => void;
  parameters?: IExplorerParameters;
}

export type ExplorerTablePagination = React.FunctionComponent<ExplorerTablePaginationProps>;

export const ExplorerTablePaginationComponent: ExplorerTablePagination = ({
  classes,
  parameters,
  onChangePage,
  onChangeRowsPerPage,
  ...props
}) => {
  const handleChangePage = (_: React.MouseEvent<HTMLButtonElement> | null, page: number) => {
    onChangePage && onChangePage(page, parameters);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    const rowsPerPage = +event.target.value;
    onChangeRowsPerPage && onChangeRowsPerPage(rowsPerPage, parameters);
  };

  return (
    <TableFooter classes={{ root: classes?.root }}>
      <TableRow>
        <TablePagination
          classes={{ root: classes?.pagination }}
          {...props}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </TableRow>
    </TableFooter>
  );
};

const mapDispatchToProps = (dispatch: React.Dispatch<IExplorerAction>) => {
  const onChangePage = (page: number, parameters: IExplorerParameters) =>
    batch(() => {
      dispatch(ExplorerActions.updatePage(page));
      dispatch(ExplorerActions.updateEntities({ ...parameters, page }));
    });

  const onChangeRowsPerPage = (rowsPerPage: number, parameters: IExplorerParameters) =>
    batch(() => {
      dispatch(ExplorerActions.updateRowsPerPage(rowsPerPage));
      dispatch(ExplorerActions.updateEntities({ ...parameters, rowsPerPage }));
    });

  return { onChangePage, onChangeRowsPerPage };
};

const mapStateToProps = (state: IState) => {
  const rowsPerPageOptions = [25, 50, 100];

  const count = ExplorerSelectors.selectCount(state);
  const rowsPerPage = ExplorerSelectors.selectRowsPerPage(state);
  const page = ExplorerSelectors.selectPage(state);
  const parameters = ExplorerSelectors.selectParameters(state);

  return { rowsPerPageOptions, count, rowsPerPage, page, parameters };
};

export const ExplorerTablePagination = connect(
  mapStateToProps,
  mapDispatchToProps
)(ExplorerTablePaginationComponent);

export default ExplorerTablePagination;
