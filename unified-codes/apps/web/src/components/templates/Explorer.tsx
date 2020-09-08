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

export interface ExplorerProps {
  data?: IExplorerData;
  variables?: IExplorerVariables;
  onReady: () => void;
  onSearch: (request: IEntitySearchRequest) => void;
  onUpdateVariables: (variables: IExplorerVariables) => void;
}

export type Explorer = React.FunctionComponent<ExplorerProps>;

export const ExplorerComponent: Explorer = ({
  data,
  variables = {},
  onReady,
  onUpdateVariables,
}) => {
  React.useEffect(() => {
    onReady();
  }, []);
  const entityData = data || {
    entities: [] as Array<Entity>,
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
        data={entityData}
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
  const data = ExplorerSelectors.entitiesSelector(state);
  const variables = ExplorerSelectors.variablesSelector(state);
  return { data, variables };
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
