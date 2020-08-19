import { combineReducers } from 'redux';
import { MessageReducer } from './MessageReducer';
import { UserReducer } from './UserReducer';

export const reducers = combineReducers({ message: MessageReducer, user: UserReducer });
