import { configureStore } from '@reduxjs/toolkit';
import userReducer from './reducers/userReducer';
import modalAdItemReducer from './reducers/modalAdItemReducer';

export const store = configureStore({
  reducer: {
    user: userReducer,
    modalAdItem: modalAdItemReducer,
  }
});

export type RootState = ReturnType<typeof store.getState>;