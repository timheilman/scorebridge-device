import { Action, configureStore, ThunkAction } from "@reduxjs/toolkit";

import playerNameEntryReducer from "../features/playerNameEntry/playerNameEntrySlice";

export const store = configureStore({
  reducer: {
    club: playerNameEntryReducer,
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
