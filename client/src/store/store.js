import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';

/**
 * Root Redux store.
 *
 * authSlice - Authentication state management
 * Future slices: transactions, budgets, goals, etc. (in later phases)
 */
const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

export default store;
