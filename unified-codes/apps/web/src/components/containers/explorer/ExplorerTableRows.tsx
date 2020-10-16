import * as React from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { TableCell, TableRow } from '@unified-codes/ui/components';
import { withStyles } from '@unified-codes/ui/styles';
import { EEntityField, IEntity } from '@unified-codes/data';

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
}

export type ExplorerTableRows = React.FunctionComponent<ExplorerTableRowsProps>;

const useViewEntity = () => {
  const history = useHistory();
  return (entity: IEntity) => history.push(`/detail/${entity.code}`);
};

const ExplorerTableRowsComponent: ExplorerTableRows = ({ classes, columns, entities }) => {
  const viewEntity = useViewEntity();

  const rows = entities.map((entity: IEntity, index) => {
    const rowKey = entity.code;
    const rowClass = index % 2 ? classes?.rowPrimary : classes?.rowSecondary;
    const rowCells = columns.map(column => {
      switch(column) {
        case EEntityField.CODE: return <TableCell key="code" className={classes?.cell}>{entity.code}</TableCell>;
        case EEntityField.DESCRIPTION: return <TableCell key="description" className={classes?.cell}>{entity.description}</TableCell>;
        case EEntityField.TYPE: return <TableCell key="type" className={classes?.cell}>{entity.type}</TableCell>;
      }
    });

    const onRowClick = () => viewEntity(entity);

    return (
      <TableRow key={rowKey} className={rowClass} onClick={onRowClick}>
        {rowCells}
      </TableRow>
    );
  });

  return <TableBody>{rows}</TableBody>;
};

const mapStateToProps = (state: IState) => {
  const columns = [EEntityField.CODE, EEntityField.DESCRIPTION, EEntityField.TYPE];
  const entities = ExplorerSelectors.selectEntities(state);

  return { columns, entities };
};

export const ExplorerTableRows = connect(mapStateToProps)(
  withStyles(styles)(ExplorerTableRowsComponent)
);

export default ExplorerTableRows;
