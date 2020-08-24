import React from 'react';

import { IAlert } from '@unified-codes/data';

import Alert from '../atoms/Alert';
import Snackbar from '../atoms/Snackbar';

export interface AlertBarProps extends IAlert {
  autoHideDuration?: number;
  onClose?: () => void;
}

export type AlertBar = React.FunctionComponent<AlertBarProps>;

export const AlertBar: AlertBar = ({
  isVisible,
  severity,
  text,
  autoHideDuration = 6000,
  onClose = () => null,
}) => (
  <Snackbar open={isVisible} autoHideDuration={autoHideDuration} onClose={onClose}>
    <Alert onClose={onClose} severity={severity}>
      {text}
    </Alert>
  </Snackbar>
);

export default AlertBar;
