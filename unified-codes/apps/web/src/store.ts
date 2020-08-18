import { applyMiddleware, createStore, combineReducers } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';

import { AlertReducer, UserReducer } from './reducers';
import { rootSaga } from './sagas';

const sagaMiddleware = createSagaMiddleware();

const reducers = combineReducers({ alert: AlertReducer, user: UserReducer });

const store = createStore(reducers, applyMiddleware(sagaMiddleware));

sagaMiddleware.run(rootSaga);

export default store;
