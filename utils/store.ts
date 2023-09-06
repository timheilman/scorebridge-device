import { Action, configureStore, ThunkAction } from "@reduxjs/toolkit";

import playerNameEntryReducer from "../features/playerNameEntry/playerNameEntrySlice";
import subscriptionStatesReducerKv from "../scorebridge-ts-submodule/subscriptionStatesSlice";

export const store = configureStore({
  reducer: {
    club: playerNameEntryReducer,
    ...subscriptionStatesReducerKv,
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
