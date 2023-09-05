import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DocumentNode } from "graphql/language";

import { subscriptionUpdatedClub } from "../../scorebridge-ts-submodule/graphql/subscriptions";
import { RootState } from "../../utils/store";

export interface SubscriptionsState {
  value: Record<string, string>;
}

export interface allSubscriptionsI {
  updatedClub: DocumentNode;
}

export const subIdToSubGql: allSubscriptionsI = {
  updatedClub: subscriptionUpdatedClub,
};
const initialState: SubscriptionsState = {
  value: Object.keys(subIdToSubGql).reduce(
    (acc: Record<string, string>, subId) => {
      acc[subId] = "disconnected";
      return acc;
    },
    {},
  ),
};

export const subscriptionsSlice = createSlice({
  name: "subscriptions",
  initialState,
  reducers: {
    setSubscriptionStatus: (
      state,
      action: PayloadAction<[keyof allSubscriptionsI, string]>,
    ) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.value[action.payload[0]] = action.payload[1];
    },
  },
});

export const { setSubscriptionStatus } = subscriptionsSlice.actions;

export const selectSubscriptionById =
  (subId: keyof allSubscriptionsI) => (state: RootState) =>
    state.subscriptions.value[subId];
export default subscriptionsSlice.reducer;
