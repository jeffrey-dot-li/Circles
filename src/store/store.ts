
import { applyMiddleware, configureStore, createStore } from '@reduxjs/toolkit';
import thunkMiddleware from 'redux-thunk';
import { rootReducer } from './reducers';
const composedEnhancer = (applyMiddleware(thunkMiddleware));

const store = createStore(rootReducer, composedEnhancer);
// store.dispatch(verifyAuth);

export default store;
