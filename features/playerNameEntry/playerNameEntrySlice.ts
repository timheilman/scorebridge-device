import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { Club } from "../../scorebridge-ts-submodule/graphql/appsync";
import { RootState } from "../../utils/store";

export interface ClubState {
  value: Club | null;
}

const initialState: ClubState = {
  value: null,
};

export const clubSlice = createSlice({
  name: "club",
  initialState,
  reducers: {
    setClub: (state, action: PayloadAction<Club | null>) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.value = action.payload;
    },
  },
});

export const { setClub } = clubSlice.actions;

export const selectClub = (state: RootState) => state.club.value;

export default clubSlice.reducer;
