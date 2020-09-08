import * as React from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';

import { EntityBrowser, Grid } from '@unified-codes/ui';
import { Entity, IPaginationRequest, PaginationRequest } from '@unified-codes/data';

import { ExplorerActions } from '../../actions';
import { IExplorerData, IState } from '../../types';
import { ExplorerSelectors } from '../../selectors';

export interface ExplorerProps {
  entities?: IExplorerData;
  onReady: () => void;
  onClear: () => void;
  onFetch: (request: IPaginationRequest) => void;
  onSearch: (input: string) => void;
}

export type Explorer = React.FunctionComponent<ExplorerProps>;

export const ExplorerComponent: Explorer = ({ entities, onReady, onClear, onFetch, onSearch }) => {
  React.useEffect(() => {
    onReady();
  }, []);
  const entityData = entities || {
    data: [] as Array<Entity>,
    hasMore: false,
    totalResults: 0,
  };

  return (
    <Grid container justify="center">
      <EntityBrowser
        entities={entityData}
        onClear={onClear}
        onSearch={onSearch}
        onFetch={onFetch}
      />
    </Grid>
  );
};

const mapStateToProps = (state: IState) => {
  const entities = ExplorerSelectors.entitiesSelector(state);
  return { entities };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  const onClear = () => dispatch(ExplorerActions.resetVariables());
  const onReady = () => dispatch(ExplorerActions.fetchData(new PaginationRequest()));
  // TODO refactor when lifting search out
  const onFetch = (request: IPaginationRequest) => dispatch(ExplorerActions.fetchData(request));
  const onSearch = (input: string) =>
    dispatch(ExplorerActions.updateVariables({ code: input, description: input }));
  return { onClear, onFetch, onReady, onSearch };
};

export const Explorer = connect(mapStateToProps, mapDispatchToProps)(ExplorerComponent);

export default Explorer;
