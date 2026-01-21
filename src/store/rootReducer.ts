import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './slices/auth.slice';
import uiReducer from './slices/ui.slice';

export const rootReducer = combineReducers({
  auth: authReducer,
  ui: uiReducer,
});
