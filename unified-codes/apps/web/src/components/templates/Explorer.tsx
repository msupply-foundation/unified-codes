import * as React from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';

import { EntityBrowser, IEntityBrowserClasses, IEntityType } from '@unified-codes/ui';
import {
  EntityCollection,
  EntitySearchRequest,
  IEntityCollection,
  IEntitySearchRequest,
  IExplorerVariables,
} from '@unified-codes/data';

import { ExplorerActions } from '../../actions';
import { IState } from '../../types';
import { ExplorerSelectors } from '../../selectors';

import { withStyles } from '@material-ui/core/styles';
import { ITheme, overflow } from '../../muiTheme';

const FOOTER_HEADER_HEIGHT = 370;

export interface ExplorerProps {
  classes?: IEntityBrowserClasses;
  entities?: IEntityCollection;
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
      overflowY: 'scroll' as overflow,
      '& th': { backgroundColor: theme.palette.background.toolbar, fontWeight: 700 },
      '& thead > tr': { borderBottom: borderStyle },
      '& tr > th': { borderRight: borderStyle },
      '& tr > td': { borderRight: borderStyle, borderBottom: 0 },
      '& tr > td:last-child': { borderRight: 0 },
      '& tr > th:last-child': { borderRight: 0 },
      '& tr > td:first-child': { fontWeight: 700 },
    },
    tableContainer: {
      backgroundColor: theme.palette.background.default,
      margin: '-20px auto 0 auto',
      maxHeight: '100%',
      maxWidth: 900,
      borderRadius: 5,
    },
    typeFilter: {
      backgroundColor: theme.palette.background.footer,
      paddingBottom: 24,
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
  const entityCollection = entities || new EntityCollection();

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

  const handleSort = (orderBy: string) => {
    const orderDesc = orderBy === variables?.orderBy ? !variables.orderDesc : false;
    onUpdateVariables({ ...variables, orderBy, orderDesc });
  };

  const handleTypesChange = (entityTypes: Array<IEntityType>) => {
    const type = entityTypes
      .filter((t) => t.active)
      .map((t) => t.name.toLowerCase().replace(' ', '_'))
      .join(' ');
    onUpdateVariables({ ...variables, type });
  };

  const childProps = {
    tableProps: { alternatingRowColour: '#f5f5f5', stripedRows: true },
    rowProps: { rowProps: { style: { backgroundColor: '' } } },
  };

  return (
    <EntityBrowser
      childProps={childProps}
      classes={classes}
      entities={entityCollection}
      onChangePage={handleChangePage}
      onChangeRowsPerPage={handleChangeRowsPerPage}
      onClear={handleClear}
      onSearch={handleSearch}
      onSort={handleSort}
      onTypesChange={handleTypesChange}
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
