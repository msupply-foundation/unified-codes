import * as React from 'react';
import { batch, connect } from 'react-redux';

import {
  ArrowDownIcon,
  ArrowUpIcon,
  TableHead,
  TableCell,
  TableRow,
} from '@unified-codes/ui/components';
import { withStyles, Position } from '@unified-codes/ui/styles';
import { EEntityField } from '@unified-codes/data';

import { ExplorerActions, IExplorerAction } from '../../../actions';
import { ExplorerSelectors } from '../../../selectors';
import { IState } from '../../../types';
import { ITheme } from '../../../styles';

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
    position: 'sticky' as Position,
    top: 0,
    '&:last-child': { borderRight: 0 },
    '&:first-letter': { textTransform: 'capitalize' },
  },
  icon: {
    marginBottom: -7,
  },
});

export interface ExplorerTableHeaderProps {
  classes?: {
    root?: string;
    row?: string;
    cell?: string;
    icon?: string;
  };
  columns: string[];
  orderDesc?: boolean;
  orderBy?: string;
  onSort?: (value: string) => void;
}

export type ExplorerTableHeader = React.FunctionComponent<ExplorerTableHeaderProps>;

const ExplorerTableHeaderComponent: ExplorerTableHeader = ({
  classes,
  columns,
  orderBy,
  orderDesc,
  onSort,
}) => {
  const sortIcon = orderDesc ? (
    <ArrowUpIcon className={classes?.icon} />
  ) : (
    <ArrowDownIcon className={classes?.icon} />
  );

  const headerCells = columns.map((column: string) => {
    const onClick = () => onSort && onSort(column);
    const icon = orderBy === column ? sortIcon : null;
    return (
      <TableCell classes={{ root: classes?.cell }} key={column} onClick={onClick}>
        {column}
        {icon}
      </TableCell>
    );
  });

  return (
    <TableHead classes={{ root: classes?.root }}>
      <TableRow classes={{ root: classes?.row }}>{headerCells}</TableRow>
    </TableHead>
  );
};

const mapDispatchToProps = (dispatch: React.Dispatch<IExplorerAction>) => {
  const onSort = (column: string) => {
    batch(() => {
      dispatch(ExplorerActions.updateOrderBy(column as EEntityField));
      dispatch(ExplorerActions.updateEntities());
    });
  };
  return { onSort };
};

const mapStateToProps = (state: IState) => {
  const columns = [EEntityField.CODE, EEntityField.DESCRIPTION, EEntityField.TYPE];

  const orderBy = ExplorerSelectors.selectOrderBy(state);
  const orderDesc = ExplorerSelectors.selectOrderDesc(state);

  return { columns, orderBy, orderDesc };
};

export const ExplorerTableHeader = connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(ExplorerTableHeaderComponent));

export default ExplorerTableHeader;
