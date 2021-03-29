import * as React from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import * as copy from 'clipboard-copy';

import {
  FileCopyIcon,
  Grid,
  IconButton,
  TableBody,
  TableCell,
  TableRow,
} from '@unified-codes/ui/components';
import { withStyles } from '@unified-codes/ui/styles';
import { EEntityField, IEntity } from '@unified-codes/data/v1';

import { AlertActions, IAlertAction, IExplorerAction } from '../../../actions';
import { ExplorerSelectors } from '../../../selectors';
import { AlertSeverity, IState } from '../../../types';
import { ITheme } from '../../../styles';

const styles = (theme: ITheme) => {
  const row = {
    cursor: 'pointer',
    '&:hover': { backgroundColor: theme.palette.background.toolbar },
    '& td:last-child': { borderRight: 0 },
    '& td:first-child': { fontWeight: 700 },
  };

  const icon = {
    padding: '4px',
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
      padding: '8px',
      borderRight: `1px solid ${theme.palette.divider}`,
      borderBottom: 0,
    },
    iconPrimary: {
      ...icon,
      '&:hover': { backgroundColor: theme.palette.background.default },
    },
    iconSecondary: {
      ...icon,
      '&:hover': { backgroundColor: theme.palette.background.paper },
    },
  };
};

export interface ExplorerTableRowsProps {
  classes?: {
    root?: string;
    rowPrimary?: string;
    rowSecondary?: string;
    cell?: string;
    iconPrimary?: string;
    iconSecondary?: string;
  };
  columns: EEntityField[];
  entities: IEntity[];
  onCopy: (code: string) => null;
}

export type ExplorerTableRows = React.FunctionComponent<ExplorerTableRowsProps>;

const useViewEntity = () => {
  const history = useHistory();
  return (entity: IEntity) => history.push(`/detail/${entity.code}`);
};

const ExplorerTableRowsComponent: ExplorerTableRows = ({ classes, columns, entities, onCopy }) => {
  const viewEntity = useViewEntity();

  const rows = entities.map((entity: IEntity, index) => {
    const { code } = entity;

    const rowKey = code;
    const rowClass = index % 2 ? classes?.rowPrimary : classes?.rowSecondary;
    const iconClass = index % 2 ? classes?.iconPrimary : classes?.iconSecondary;
    const rowCells = columns.map((column) => {
      switch (column) {
        case EEntityField.CODE:
          return (
            <TableCell key="code" className={classes?.cell}>
              <Grid container direction="row" justify="space-around" alignItems="center">
                <Grid item>{entity.code}</Grid>
                <Grid item>
                  <IconButton
                    className={iconClass}
                    onClick={(e) => {
                      onCopy(code);
                      e.stopPropagation();
                    }}
                  >
                    <FileCopyIcon />
                  </IconButton>
                </Grid>
              </Grid>
            </TableCell>
          );
        case EEntityField.DESCRIPTION:
          return (
            <TableCell key="description" className={classes?.cell}>
              {entity.description}
            </TableCell>
          );
        case EEntityField.TYPE:
          return (
            <TableCell key="type" className={classes?.cell}>
              {entity.type}
            </TableCell>
          );
        default:
          return null;
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

const mapDispatchToProps = (dispatch: React.Dispatch<IExplorerAction | IAlertAction>) => {
  const onCopy = (code: string) => {
    copy(code);
    dispatch(
      AlertActions.raiseAlert({
        severity: AlertSeverity.Info,
        text: `Code ${code} copied to clipboard`,
        isVisible: true,
      })
    );
  };

  return { onCopy };
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
