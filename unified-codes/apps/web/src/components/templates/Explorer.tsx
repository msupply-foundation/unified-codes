import * as React from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';

import { useQuery, gql } from '@apollo/client';

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

const query = gql`
  query allEntities {
    entities {
      code
      description
      type
    }
  }
`;

export interface ExplorerProps {
  entities: Entity[],
  onData: (data: { entities: IEntity[] }) => void,
  onError: () => void,
  onLoading: () => void
}

export type Explorer = React.FunctionComponent<ExplorerProps>;

export const ExplorerComponent: Explorer = ({ entities, onData, onError, onLoading }) => {
  const { loading, error, data } = useQuery(query);

  React.useEffect(() => {
    if (!entities.length) {
      if (data) {
        onData(data);
      } else if (error) {
        onError();
      } else if (loading) {
        onLoading();
      }
    } 
  }, [entities, loading, error, data]);

  return (
    <Grid container justify="center">
      <EntityBrowser entities={entities} />
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

  const onData = (data: { entities: IEntity[] }) => dispatch(EntityActions.updateEntities(data));
  const onError = () => dispatch(AlertActions.showAlert(alertError));
  const onLoading = () => dispatch(AlertActions.showAlert(alertFetch));

  return { onData, onError, onLoading };
}

export const Explorer = connect(mapStateToProps, mapDispatchToProps)(ExplorerComponent);

export default Explorer;
