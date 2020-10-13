import * as React from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { TableCell, TableRow } from '@unified-codes/ui/components';
import { withStyles } from '@unified-codes/ui/styles';
import { EEntityField, IEntity } from '@unified-codes/data';

import { DetailActions, IExplorerAction } from '../../../actions';
import { ExplorerSelectors } from '../../../selectors';
import { IState } from '../../../types';
import { ITheme } from '../../../styles';
import { TableBody } from '@material-ui/core';

const styles = (theme: ITheme) => {
  const row = {
    cursor: 'pointer',
    '&:hover': { backgroundColor: theme.palette.background.toolbar },
    '& td:last-child': { borderRight: 0 },
    '& td:first-child': { fontWeight: 700 },
  };

  return {
    root: {},
    rowPrimary: {
      ...row,
      background: theme.palette.background.default,
    },
    rowSecondary: {
      ...row,
      background: theme.palette.background.paper,
    },
    cell: {
      borderRight: `1px solid ${theme.palette.divider}`,
      borderBottom: 0,
    },
  };
};

export interface ExplorerTableRowsProps {
  classes?: {
    root?: string;
    rowPrimary?: string;
    rowSecondary?: string;
    cell?: string;
  };
  columns: EEntityField[];
  entities: IEntity[];
  onSelect: (entity: IEntity) => void;
}

export type ExplorerTableRows = React.FunctionComponent<ExplorerTableRowsProps>;

const ExplorerTableRowsComponent: ExplorerTableRows = ({
  classes,
  columns,
  entities,
  onSelect,
}) => {
  const history = useHistory();

  const rows = entities.map((entity: IEntity, index) => {
    const rowKey = entity.code;
    const rowClass = index % 2 ? classes?.rowPrimary : classes?.rowSecondary;
    const rowCells = columns.map((column) => (
      <TableCell key={column} className={classes?.cell}>
        {entity[column as EEntityField]}
      </TableCell>
    ));

    const onClickRow = () => {
      history.push(`/detail/${entity.code}`);
      onSelect(entity);
    };

    return (
      <TableRow key={rowKey} className={rowClass} onClick={onClickRow}>
        {rowCells}
      </TableRow>
    );
  });

  return <TableBody className={classes?.root}>{rows}</TableBody>;
};

const mapDispatchToProps = (dispatch: React.Dispatch<IExplorerAction>) => {
  const onSelect = (entity: IEntity) => {
    dispatch(DetailActions.updateEntity(entity));
  };

  return { onSelect };
};

const mapStateToProps = (state: IState) => {
  const columns = [EEntityField.CODE, EEntityField.DESCRIPTION, EEntityField.TYPE];
  const entities = ExplorerSelectors.selectEntities(state);

  return { columns, entities };
};

export const ExplorerTableRows = connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(ExplorerTableRowsComponent));

export default ExplorerTableRows;
