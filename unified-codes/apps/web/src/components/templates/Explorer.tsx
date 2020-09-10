import * as React from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';

import { EntityBrowser, IEntityBrowserClasses } from '@unified-codes/ui';
import {
  Entity,
  EntitySearchRequest,
  IEntitySearchRequest,
  IExplorerVariables,
} from '@unified-codes/data';

import { ExplorerActions } from '../../actions';
import { IExplorerData, IState } from '../../types';
import { ExplorerSelectors } from '../../selectors';

import { withStyles } from '@material-ui/core/styles';
import { ITheme } from '../../muiTheme';

const FOOTER_HEADER_HEIGHT = 300;

export interface ExplorerProps {
  classes?: IEntityBrowserClasses;
  entities?: IExplorerData;
  variables?: IExplorerVariables;

  onReady: () => void;
  onSearch: (request: IEntitySearchRequest) => void;
  onUpdateVariables: (variables: IExplorerVariables) => void;
}

const getStyles = (theme: ITheme) => {
  const borderStyle = `1px solid ${theme.palette.divider}`;
  return {
    pagination: { backgroundColor: theme.palette.background.toolbar },
    root: { backgroundColor: theme.palette.background.default, maxHeight: '100%', maxWidth: 900 },
    searchBar: { paddingLeft: 15 },
    table: {
      marginTop: 5,
      maxHeight: `calc(100vh - ${FOOTER_HEADER_HEIGHT}px)`,
      overflow: 'scroll',
      '& th': { backgroundColor: theme.palette.background.toolbar, fontWeight: 700 },
      '& thead > tr': { borderBottom: borderStyle },
      '& tr > th': { borderRight: borderStyle },
      '& tr > td': { borderRight: borderStyle, borderBottom: 0 },
      '& tr > td:last-child': { borderRight: 0 },
      '& tr > th:last-child': { borderRight: 0 },
      '& tr > td:first-child': { fontWeight: 700 },
    },
  };
};

export type Explorer = React.FunctionComponent<ExplorerProps>;

export const ExplorerComponent: Explorer = ({
  classes,
  entities,
  variables = {},
  onReady,
  onUpdateVariables,
}) => {
  React.useEffect(() => {
    onReady();
  }, []);
  const entityData = entities || {
    data: [] as Array<Entity>,
    hasMore: false,
    totalResults: 0,
  };

  const handleClear = () => {
    onUpdateVariables({ ...variables, description: '', page: 0 });
  };

  const handleSearch = (value: string) => {
    const { description } = variables;
    const page = description === value ? variables.page || 0 : 0;

    onUpdateVariables({ ...variables, description: value, page });
  };

  const handleChangePage = (page: number) => {
    onUpdateVariables({ ...variables, page });
  };

  const handleChangeRowsPerPage = (rowsPerPage: number) => {
    onUpdateVariables({ ...variables, page: 0, rowsPerPage });
  };

  const childProps = {
    tableProps: { alternatingRowColour: '#f5f5f5', stripedRows: true },
    rowProps: { rowProps: { style: { backgroundColor: '' } } },
  };

  return (
    <EntityBrowser
      childProps={childProps}
      classes={classes}
      entities={entityData}
      onChangePage={handleChangePage}
      onChangeRowsPerPage={handleChangeRowsPerPage}
      onClear={handleClear}
      onSearch={handleSearch}
      variables={variables}
    />
  );
};

const mapStateToProps = (state: IState) => {
  const entities = ExplorerSelectors.entitiesSelector(state);
  const variables = ExplorerSelectors.variablesSelector(state);
  return { entities, variables };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  const onReady = () => dispatch(ExplorerActions.fetchData(new EntitySearchRequest()));
  const onSearch = (request: IEntitySearchRequest) => dispatch(ExplorerActions.fetchData(request));
  const onUpdateVariables = (variables: IExplorerVariables) =>
    dispatch(ExplorerActions.updateVariables(variables));

  return { onReady, onSearch, onUpdateVariables };
};

const StyledExplorer = withStyles(getStyles)(ExplorerComponent);
export const Explorer = connect(mapStateToProps, mapDispatchToProps)(StyledExplorer);

export default Explorer;
