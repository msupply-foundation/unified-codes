import { Color } from '@material-ui/lab/Alert';

export type AlertSeverity = Color;

export interface IAlert {
  severity: AlertSeverity;
  text: string;
  isVisible: boolean;
}

export class Alert implements IAlert {
  severity: AlertSeverity;
  text: string;
  isVisible: boolean;

  constructor(alert: IAlert) {
    this.severity = alert.severity;
    this.text = alert.text;
    this.isVisible = alert.isVisible;
  }
}

export const AlertSeverity: { [key: string]: AlertSeverity } = {
  success: 'success',
  info: 'info',
  warning: 'warning',
  error: 'error',
};
