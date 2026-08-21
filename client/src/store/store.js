import { configureStore } from '@reduxjs/toolkit';

/**
 * Root Redux store.
 *
 * No feature slices are added yet — this only confirms that
 * Redux Toolkit is wired up correctly. Business-related slices
 * (auth, transactions, budgets, etc.) will be added in their
 * respective phases.
 */
const store = configureStore({
  reducer: {},
});

export default store;
