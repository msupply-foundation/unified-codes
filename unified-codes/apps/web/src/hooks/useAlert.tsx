import * as React from 'react';

import { IAlert, AlertSeverity } from '@unified-codes/data';

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

export default useAlert;
