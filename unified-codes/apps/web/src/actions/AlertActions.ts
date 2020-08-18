import { Action } from 'redux';

import { IAlert } from '@unified-codes/data';

export const ALERT_ACTIONS = {
  HIDE: 'alertActions/hide',
  SHOW: 'alertActions/show',
};

export interface IAlertAction extends Action<string> {
  alert: IAlert;
}

const hideAlert = () => ({
  type: ALERT_ACTIONS.HIDE,
});

const showAlert = (alert: IAlert) => ({
  type: ALERT_ACTIONS.SHOW,
  alert,
});

export default {
  hideAlert,
  showAlert,
};
