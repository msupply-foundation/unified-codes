import React from 'react';

import { AlertSeverity, IAlert } from '@unified-codes/data';

import AlertBar from './AlertBar';
import { useAlert } from '../../../hooks';

export default {
  component: AlertBar,
  title: 'AlertBar',
};

export const errorAlertBar = () => {
  const initialAlert: IAlert = {
    text: 'This is an error message!',
    severity: AlertSeverity.error,
    isVisible: true,
  };

  const { alert, resetAlert } = useAlert(initialAlert);

  return (
    <AlertBar
      isVisible={alert.isVisible}
      severity={alert.severity}
      text={alert.text}
      autoHideDuration={6000}
      onClose={resetAlert}
    />
  );
};

export const warningAlertBar = () => {
  const initialAlert: IAlert = {
    text: 'This is a warning message!',
    severity: AlertSeverity.warning,
    isVisible: true,
  };

  const { alert, resetAlert } = useAlert(initialAlert);

  return (
    <AlertBar
      isVisible={alert.isVisible}
      severity={alert.severity}
      text={alert.text}
      autoHideDuration={6000}
      onClose={resetAlert}
    />
  );
};

export const informationAlertBar = () => {
  const initialAlert: IAlert = {
    text: 'This is an information message!',
    severity: AlertSeverity.info,
    isVisible: true,
  };

  const { alert, resetAlert } = useAlert(initialAlert);

  return (
    <AlertBar
      isVisible={alert.isVisible}
      severity={alert.severity}
      text={alert.text}
      autoHideDuration={6000}
      onClose={resetAlert}
    />
  );
};

export const successAlertBar = () => {
  const initialAlert: IAlert = {
    text: 'This is a success message!',
    severity: AlertSeverity.success,
    isVisible: true,
  };

  const { alert, resetAlert } = useAlert(initialAlert);

  return (
    <AlertBar
      isVisible={alert.isVisible}
      severity={alert.severity}
      text={alert.text}
      autoHideDuration={6000}
      onClose={resetAlert}
    />
  );
};
