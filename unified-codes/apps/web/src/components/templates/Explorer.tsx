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

export interface ExplorerProps {
  classes?: IEntityBrowserClasses;
  entities?: IExplorerData;
  variables?: IExplorerVariables;

  onReady: () => void;
  onSearch: (request: IEntitySearchRequest) => void;
  onUpdateVariables: (variables: IExplorerVariables) => void;
}

const getStyles = (theme: ITheme) => ({
  pagination: { backgroundColor: theme.palette.background.toolbar },
  table: { maxHeight: 'calc(100vh - 325px)', overflow: 'scroll' },
});

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

  return (
    <EntityBrowser
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
