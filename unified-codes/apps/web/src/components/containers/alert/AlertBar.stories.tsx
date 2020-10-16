import React from 'react';

import AlertBar from './AlertBar';

import { AlertSeverity, IAlert } from '../../../types';

const defaultAlert: IAlert = { isVisible: false, severity: AlertSeverity.info, text: '' };

export const useAlert = (initialState: IAlert = defaultAlert) => {
  const [alert, setAlert] = React.useState(initialState);

  const resetAlert = React.useCallback(() => setAlert(defaultAlert), [setAlert]);

  const setAlertIsVisible = React.useCallback(
    (isVisible: boolean) => setAlert({ ...alert, isVisible }),
    [setAlert]
  );

  const setAlertSeverity = React.useCallback(
    (severity: AlertSeverity) => setAlert({ ...alert, severity }),
    [setAlert]
  );

  const setAlertText = React.useCallback((text: string) => setAlert({ ...alert, text }), [
    setAlert,
  ]);

  return {
    alert,
    setAlert,
    resetAlert,
    setAlertIsVisible,
    setAlertSeverity,
    setAlertText,
  };
};

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
