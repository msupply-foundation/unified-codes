import { Color as t_Color } from "@material-ui/lab/Alert";

export type Severity = t_Color;

export interface IMessage {
  severity: Severity;
  text: string;
  visible?: boolean;
}
