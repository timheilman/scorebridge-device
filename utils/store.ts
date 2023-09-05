import { Action, configureStore, ThunkAction } from "@reduxjs/toolkit";

import playerNameEntryReducer from "../features/playerNameEntry/playerNameEntrySlice";
import subscriptionsReducer from "../features/subscriptions/subscriptionsSlice";

export const store = configureStore({
  reducer: {
    club: playerNameEntryReducer,
    subscriptions: subscriptionsReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
