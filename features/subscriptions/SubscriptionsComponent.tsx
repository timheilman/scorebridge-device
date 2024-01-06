import { getClubDeviceGql } from "../../scorebridge-ts-submodule/graphql/queries";
import {
  subscriptionOnUpdateClub,
  subscriptionOnUpdateClubDevice,
} from "../../scorebridge-ts-submodule/graphql/subscriptions";
import { client } from "../../scorebridge-ts-submodule/react/gqlClient";
import {
  AccessParams,
  errorCatchingSubscription,
  getClub,
  useSubscriptions,
} from "../../scorebridge-ts-submodule/react/subscriptions";
import { retryOnNetworkFailurePromise } from "../../scorebridge-ts-submodule/retryOnNetworkFailurePromise";
import { logFn } from "../../utils/logging";
import { setClub } from "../playerNameEntry/playerNameEntrySlice";
import { setClubDevice } from "../tableNumberEntry/tableNumberEntrySlice";
const log = logFn("src.features.subscriptions.SubscriptionComponent.");
export interface SubscriptionComponentParams {
  clubId: string;
  clubDeviceId: string;
}

export const getClubDevice = ({
  clubId,
  authMode,
  dispatch,
  clubDeviceId,
}: AccessParams) => {
  if (!clubDeviceId) {
    throw new Error("No clubDeviceId found in getClubDevice");
  }
  return client
    .graphql({
      query: getClubDeviceGql,
      variables: {
        clubId,
        clubDeviceId,
      },
      authMode,
    })
    .then((res) => {
      if (res.errors) {
        throw new Error(JSON.stringify(res.errors, null, 2));
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      dispatch(setClubDevice(res.data.getClubDevice));
    });
};

export default function SubscriptionsComponent({
  clubId,
  clubDeviceId,
}: SubscriptionComponentParams) {
  const fetchRecentData = async (accessParams: AccessParams) => {
    // Retrieve some/all data from AppSync
    const promises: Promise<unknown>[] = [];
    promises.push(
      retryOnNetworkFailurePromise(() => getClub(accessParams, setClub)),
    );
    promises.push(
      retryOnNetworkFailurePromise(() => getClubDevice(accessParams)),
    );
    await Promise.all(promises);
  };

  function subscribeToAll(accessParams: AccessParams) {
    log("hubListen.connected", "debug");
    errorCatchingSubscription({
      accessParams,
      subId: "onUpdateClub",
      query: subscriptionOnUpdateClub,
      variables: {
        id: accessParams.clubId,
      },
      callback: (club) => {
        log("typedSubscription.onUpdateClubCallback", "debug", { club });
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        accessParams.dispatch(setClub(club));
      },
    });
    errorCatchingSubscription({
      accessParams,
      subId: "onUpdateClubDevice",
      query: subscriptionOnUpdateClubDevice,
      variables: {
        clubId: accessParams.clubId,
        clubDeviceId: accessParams.clubDeviceId,
      },
      callback: (clubDevice) => {
        log("typedSubscription.onUpdateClubCallback", "debug", { clubDevice });
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        accessParams.dispatch(setClubDevice(clubDevice));
      },
    });
  }
  useSubscriptions({
    clubId,
    clubDeviceId,
    subscribeToAll,
    fetchRecentData,
    clearFetchedData: () => {
      setClub(null);
      setClubDevice(null);
    },
  });
  return null;
}
