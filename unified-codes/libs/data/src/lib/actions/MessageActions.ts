import { Action } from 'redux';
import { IMessage } from '../types';

export const MESSAGE_ACTIONS = {
  HIDE: 'messageActions/hide',
  SHOW: 'messageActions/show',
};

export interface IMessageAction extends Action<string> {
  message: IMessage;
}

const hideMessage = (message: IMessage) => ({
  type: MESSAGE_ACTIONS.HIDE,
  message,
});
const showMessage = (message: IMessage) => ({
  type: MESSAGE_ACTIONS.SHOW,
  message,
});

export const MessageActions = {
  hideMessage,
  showMessage,
};
