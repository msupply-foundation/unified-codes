import { Action } from 'redux';

import { IAlert } from '@unified-codes/data';

export const ALERT_ACTIONS = {
  RAISE: 'alertActions/raise',
  RESET: 'alertActions/reset',
};


export interface IAlertRaiseAction extends Action<string> {
  alert: IAlert;
}

export interface IAlertResetAction extends Action<string> {};

export type IAlertAction = IAlertResetAction | IAlertRaiseAction;

const raiseAlert = (alert: IAlert) => ({
  type: ALERT_ACTIONS.RAISE,
  alert,
});

const resetAlert = () => ({
  type: ALERT_ACTIONS.RESET,
});


export const AlertActions = {
  raiseAlert,
  resetAlert
};

export default AlertActions;