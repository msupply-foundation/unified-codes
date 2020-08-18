import * as React from 'react';
import { useQuery, gql } from '@apollo/client';

import { Alert, EntityBrowser, Grid, Snackbar } from '@unified-codes/ui';
import { AlertSeverity, Entity, EntityNode, IAlert } from '@unified-codes/data';

import { useAlert } from '../../hooks';

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

export const Explorer = () => {
  const [entities, setEntities] = React.useState<Entity[]>([]);
  const { alert, setAlert, resetAlert } = useAlert();
  const { loading, error, data } = useQuery(query);

  const updateAlert = React.useCallback(
    (newAlert: IAlert) => {
      if (
        alert.isVisible != newAlert.isVisible ||
        alert.severity != newAlert.severity ||
        alert.text != newAlert.text
      ) {
        setAlert(newAlert);
      }
    },
    [alert, setAlert]
  );

  if (!entities.length) {
    if (data) {
      const entityData = data;
      const entities = entityData.entities.map((entityNode: EntityNode) => new Entity(entityNode));
      setEntities(entities);
    } else if (error) {
      const alertError: IAlert = {
        isVisible: true,
        severity: ALERT_SEVERITY.ERROR,
        text: ALERT_TEXT.ERROR,
      };
      updateAlert(alertError);
    } else if (loading) {
      const alertFetch: IAlert = {
        isVisible: true,
        severity: ALERT_SEVERITY.FETCH,
        text: ALERT_TEXT.FETCH,
      };
      updateAlert(alertFetch);
    }
  }

  return (
    <Grid container justify="center">
      <EntityBrowser entities={entities} />
      <Snackbar open={alert.isVisible} autoHideDuration={6000} onClose={resetAlert}>
        <Alert onClose={resetAlert} severity={alert.severity}>
          {alert.text}
        </Alert>
      </Snackbar>
    </Grid>
  );
};

export default Explorer;
