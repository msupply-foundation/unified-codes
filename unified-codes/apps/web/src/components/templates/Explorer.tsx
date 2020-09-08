import * as React from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';

import { EntityBrowser, Grid } from '@unified-codes/ui';
import { Entity, EntitySearchRequest, IEntitySearchRequest } from '@unified-codes/data';

import { ExplorerActions } from '../../actions';
import { IExplorerData, IState } from '../../types';
import { ExplorerSelectors } from '../../selectors';

export interface ExplorerProps {
  data?: IExplorerData;
  onReady: () => void;
  onClear: () => void;
  onSearch: (request: IEntitySearchRequest) => void;
}

export type Explorer = React.FunctionComponent<ExplorerProps>;

export const ExplorerComponent: Explorer = ({ data, onReady, onClear, onSearch }) => {
  React.useEffect(() => {
    onReady();
  }, []);
  const entityData = data || {
    entities: [] as Array<Entity>,
    hasMore: false,
    totalResults: 0,
  };

  return (
    <Grid container justify="center">
      <EntityBrowser data={entityData} onClear={onClear} onSearch={onSearch} />
    </Grid>
  );
};

const mapStateToProps = (state: IState) => {
  const data = ExplorerSelectors.entitiesSelector(state);
  return { data };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  const onClear = () => dispatch(ExplorerActions.resetVariables());
  const onReady = () => dispatch(ExplorerActions.fetchData(new EntitySearchRequest()));
  const onSearch = (request: IEntitySearchRequest) => dispatch(ExplorerActions.fetchData(request));
  return { onClear, onReady, onSearch };
};

export const Explorer = connect(mapStateToProps, mapDispatchToProps)(ExplorerComponent);

export default Explorer;
