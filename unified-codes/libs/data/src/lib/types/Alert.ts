import { Color } from '@material-ui/lab/Alert';

export type AlertSeverity = Color;

export interface IAlert {
  severity: AlertSeverity;
  text: string;
  isVisible: boolean;
}

export const AlertSeverity: { [key: string]: AlertSeverity } = {
  success: 'success',
  info: 'info',
  warning: 'warning',
  error: 'error',
};
