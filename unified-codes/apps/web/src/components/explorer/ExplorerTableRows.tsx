import * as React from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { EntityTableRows, IEntityTableRowsProps } from '@unified-codes/ui';
import { EEntityField, IEntity } from '@unified-codes/data';

import { DetailActions, IExplorerAction } from '../../actions';
import { ExplorerSelectors } from '../../selectors';
import { IState, ITheme } from '../../types';
import { withStyles } from '../../styles';

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

export type ExplorerTableRowsProps = IEntityTableRowsProps;

const ExplorerTableRowsComponent = (props: ExplorerTableRowsProps) => {
  const history = useHistory();

  const onSelect = (entity: IEntity) => {
    history.push(`/detail/${entity.code}`);
    props.onSelect(entity);
  };

  return <EntityTableRows {...props} onSelect={onSelect} />;
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
