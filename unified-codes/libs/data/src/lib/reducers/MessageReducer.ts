import { IMessage } from '../types';
import { IMessageAction, MESSAGE_ACTIONS } from '../actions/MessageActions';

const initialState = () => {
  return {
    severity: 'info',
    text: '',
    visible: false,
  } as IMessage;
};

export const MessageReducer = (state = initialState(), action: IMessageAction) => {
  const { type } = action;

  switch (type) {
    case MESSAGE_ACTIONS.SHOW: {
      const { message } = action;

      return { ...state, ...message };
    }
    case MESSAGE_ACTIONS.HIDE: {
      return { ...state, visible: false };
    }

    default:
      return state;
  }
};
