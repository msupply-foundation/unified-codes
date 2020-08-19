import { IAlert, AlertSeverity } from '@unified-codes/data';
import { IAlertAction, ALERT_ACTIONS, IAlertShowAction } from '../actions/AlertActions';

const initialState = () => {
  const alert: IAlert = {
    isVisible: false, 
    severity: AlertSeverity.info,
    text: '',
  }
  return alert;
};

export const AlertReducer = (state = initialState(), action: IAlertAction) => {
  const { type } = action;

  switch (type) {
    case ALERT_ACTIONS.SHOW: {
      const { alert } = action as IAlertShowAction;
      return alert;
    }

    case ALERT_ACTIONS.HIDE: {
      return initialState();
    }
    
    default:
      return state;
  }
};
