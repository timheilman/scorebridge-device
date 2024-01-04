import { Action, configureStore, ThunkAction } from "@reduxjs/toolkit";

import playerNameEntryReducer from "../features/playerNameEntry/playerNameEntrySlice";
import tableNumberEntryReducer from "../features/tableNumberEntry/tableNumberEntrySlice";
import subscriptionStatesReducer from "../scorebridge-ts-submodule/react/subscriptionStatesSlice";

export const store = configureStore({
  reducer: {
    club: playerNameEntryReducer,
    clubDevice: tableNumberEntryReducer,
    subscriptionStates: subscriptionStatesReducer,
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
