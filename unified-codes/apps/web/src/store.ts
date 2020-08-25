import {
  Store,
  Reducer,
  CombinedState,
  applyMiddleware,
  createStore,
  compose,
  combineReducers,
} from 'redux';
import createSagaMiddleware, { SagaMiddleware } from 'redux-saga';

import { AlertReducer, AuthenticatorReducer, ExplorerReducer, UserReducer } from './reducers';
import { rootSaga } from './sagas';
import { IState } from './types';

const reducer: Reducer<CombinedState<IState>> = combineReducers({
  alert: AlertReducer,
  user: UserReducer,
  explorer: ExplorerReducer,
  authenticator: AuthenticatorReducer,
});

const composeEnhancers =
  typeof window === 'object' && (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({})
    : compose;

const sagaMiddleware: SagaMiddleware<object> = createSagaMiddleware();

export const store: Store<CombinedState<IState>> = createStore(
  reducer,
  composeEnhancers(applyMiddleware(sagaMiddleware))
);

sagaMiddleware.run(rootSaga);

export default store;
