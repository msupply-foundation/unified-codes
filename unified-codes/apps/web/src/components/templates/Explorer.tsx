import * as React from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';

import { ApolloError, useLazyQuery, gql, NetworkStatus } from '@apollo/client';

import { EntityBrowser, Grid } from '@unified-codes/ui';
import { AlertSeverity, Entity, IEntity, IAlert } from '@unified-codes/data';

import EntityActions from '../../actions/EntityActions';
import AlertActions from '../../actions/AlertActions';

const ALERT_SEVERITY = {
  FETCH: AlertSeverity.info,
  ERROR: AlertSeverity.error,
};

const ALERT_TEXT = {
  FETCH: 'Fetching...',
  ERROR: 'Could not fetch data.',
};

const GET_ENTITIES = gql`
  query entities {
    entities {
      code
      description
      type
    }
  }
`;

export interface ExplorerProps {
  entities: Entity[],
  onChange: (input: string) => void,
  onClear: () => void,
  onSearch: () => void,
  onCompleted: (data: { entities: IEntity[] }) => void,
  onError: () => void,
  onLoading: () => void
}

export type Explorer = React.FunctionComponent<ExplorerProps>;

export const ExplorerComponent: Explorer = ({ entities, onChange, onClear, onSearch, onCompleted, onError, onLoading }) => {
  const [getEntities, { networkStatus }] = useLazyQuery(GET_ENTITIES, { onCompleted, onError });

  React.useEffect(() => {
    if (networkStatus === NetworkStatus.ready) {
      onLoading();
      getEntities();
    }
  }, [getEntities, onLoading]);

  return (
    <Grid container justify="center">
      <EntityBrowser entities={entities} onChange={onChange} onClear={onClear} onSearch={onSearch} />
    </Grid>
  );
};


const mapStateToProps = (state: { entities: IEntity[] }) => {
  const { entities: entityNodes } = state;
  const entities = entityNodes.map((entityNode: IEntity) => new Entity(entityNode)) ?? [];
  return { entities };
}

const mapDispatchToProps = (dispatch: Dispatch)  => {
  const alertError: IAlert = {
    isVisible: true,
    severity: ALERT_SEVERITY.ERROR,
    text: ALERT_TEXT.ERROR,
  };

  const alertFetch: IAlert = {
    isVisible: true,
    severity: ALERT_SEVERITY.FETCH,
    text: ALERT_TEXT.FETCH,
  };

  const onCompleted = (data: { entities: IEntity[] }) => dispatch(EntityActions.updateEntities(data));
  const onError = (error: ApolloError) => { console.log(error); dispatch(AlertActions.showAlert(alertError)); }
  const onLoading = () => dispatch(AlertActions.showAlert(alertFetch));

  const onChange = () => null;
  const onClear = () => null;
  const onSearch = () => null;

  return { onChange, onClear, onSearch, onCompleted, onError, onLoading };
}

export const Explorer = connect(mapStateToProps, mapDispatchToProps)(ExplorerComponent);

export default Explorer;

// const resetInput = React.useCallback(() => setInput(''), []);
// const resetData = React.useCallback(() => setData(entities), [entities]);

// const onChange = React.useCallback((value) => setInput(value), []);
// const onClear = React.useCallback(() => {
//   resetInput();
//   resetData();
// }, [resetData, resetInput]);

// const onSearch = React.useCallback(() => {
//   setData(
//     entities.filter((entity) => entity.matchesCode(input) || entity.matchesDescription(input))
//   );
// }, [entities, input]);