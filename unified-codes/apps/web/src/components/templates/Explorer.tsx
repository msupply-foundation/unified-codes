import * as React from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';

import { EntityBrowser, Grid } from '@unified-codes/ui';
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
import { ITheme, overflow } from '../../muiTheme';

const FOOTER_HEADER_HEIGHT = 385;

export interface ExplorerProps {
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
      marginTop: 8,
      maxHeight: '100%',
      maxWidth: 900,
    },
    typeFilter: {
      backgroundColor: theme.palette.background.footer,
      paddingTop: '12px',
      paddingBottom: '12px',
    },
  };
};

export type Explorer = React.FunctionComponent<ExplorerProps>;

export const ExplorerComponent: Explorer = ({
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

  return (
    <Grid container justify="center">
      <EntityBrowser
        entities={entityData}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
        onClear={handleClear}
        onSearch={handleSearch}
        variables={variables}
      />
    </Grid>
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

export const Explorer = connect(mapStateToProps, mapDispatchToProps)(ExplorerComponent);

export default Explorer;
