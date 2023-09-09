import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { ClubDevice } from "../../scorebridge-ts-submodule/graphql/appsync";
import { RootState } from "../../utils/store";

export interface ClubDeviceState {
  value: ClubDevice | null;
}

const initialState: ClubDeviceState = {
  value: null,
};

export const clubDeviceSlice = createSlice({
  name: "clubDevice",
  initialState,
  reducers: {
    setClubDevice: (state, action: PayloadAction<ClubDevice | null>) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.value = action.payload;
    },
  },
});

export const { setClubDevice } = clubDeviceSlice.actions;

export const selectClubDevice = (state: RootState) => state.clubDevice.value;

export default clubDeviceSlice.reducer;
