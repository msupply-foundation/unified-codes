import { IAlert, AlertSeverity } from '@unified-codes/data';

import { IAlertAction, ALERT_ACTIONS, IAlertRaiseAction } from '../actions';
import { IAlertState } from '../types';

const initialState = (): IAlertState => {
  const alert: IAlert = {
    isVisible: false,
    severity: AlertSeverity.info,
    text: '',
  };
  return alert;
};

export const AlertReducer = (state: IAlertState = initialState(), action: IAlertAction) => {
  const { type } = action;

  switch (type) {
    case ALERT_ACTIONS.RAISE: {
      const { alert } = action as IAlertRaiseAction;
      return alert;
    }

    case ALERT_ACTIONS.RESET: {
      return initialState();
    }

    default:
      return state;
  }
};
