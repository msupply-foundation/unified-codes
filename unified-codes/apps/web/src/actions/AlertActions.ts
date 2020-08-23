import { Action } from 'redux';

import { IAlert } from '@unified-codes/data';

export const ALERT_ACTIONS = {
  HIDE: 'alertActions/hide',
  SHOW: 'alertActions/show',
};

export interface IAlertHideAction extends Action<string> {};

export interface IAlertShowAction extends Action<string> {
  alert: IAlert;
}

export type IAlertAction = IAlertHideAction | IAlertShowAction;

const hideAlert = () => ({
  type: ALERT_ACTIONS.HIDE,
});

const showAlert = (alert: IAlert) => ({
  type: ALERT_ACTIONS.SHOW,
  alert,
});

export const AlertActions = {
  hideAlert,
  showAlert,
};

export default AlertActions;