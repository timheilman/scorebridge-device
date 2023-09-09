import {
  Club,
  ClubDevice,
} from "../../scorebridge-ts-submodule/graphql/appsync";
import {
  AccessParams,
  generateTypedSubscription,
  useSubscriptions,
} from "../../scorebridge-ts-submodule/subscriptions";
import { gqlMutation } from "../../utils/gql";
import { logFn } from "../../utils/logging";
import { setClub } from "../playerNameEntry/playerNameEntrySlice";
import { setClubDevice } from "../tableNumberEntry/tableNumberEntrySlice";
import { getClubGql } from "./gql/getClub";
import { getClubDeviceGql } from "./gql/getClubDevice";
const log = logFn("src.features.subscriptions.SubscriptionComponent.");
export interface SubscriptionComponentParams {
  clubId: string;
  clubDeviceId: string;
}
export default function SubscriptionsComponent({
  clubId,
  clubDeviceId,
}: SubscriptionComponentParams) {
  const fetchRecentData = async ({
    dispatch,
    clubId,
    clubDeviceId,
  }: AccessParams) => {
    // Retrieve some/all data from AppSync
    const promises: Promise<unknown>[] = [];
    promises.push(
      gqlMutation<Club>(getClubGql, {
        clubId,
      }).then((res) => {
        if (res.errors) {
          throw new Error(JSON.stringify(res.errors, null, 2));
        }
        if (!res.data) {
          throw new Error("no gql response data");
        }
        const d = (res.data as unknown as { getClub: Club }).getClub;
        log("dispatchingSetClub.data.getClub", "debug", {
          it: JSON.stringify(d, null, 2),
        });
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        dispatch(setClub(d));
      }),
    );
    promises.push(
      gqlMutation<Club>(getClubDeviceGql, {
        clubId,
        clubDeviceId,
      }).then((res) => {
        if (res.errors) {
          throw new Error(JSON.stringify(res.errors, null, 2));
        }
        if (!res.data) {
          throw new Error("no gql response data");
        }
        const d = (res.data as unknown as { getClubDevice: ClubDevice })
          .getClubDevice;
        log("dispatchingSetClubDevice.data.getClubDevice", "debug", {
          it: JSON.stringify(d, null, 2),
        });
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        dispatch(setClubDevice(d));
      }),
    );
    await Promise.all(promises);
  };

  function subscribeToAll(accessParams: AccessParams) {
    log("hubListen.connected", "debug");
    generateTypedSubscription(
      accessParams,
      "updatedClub",
      (res) => {
        log("typedSubscription.updatedClubCallback", "debug", { res });
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        accessParams.dispatch(setClub(res.updatedClub));
      },
      "id",
    );
    generateTypedSubscription(accessParams, "updatedClubDevice", (res) => {
      log("typedSubscription.updatedClubCallback", "debug", { res });
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      accessParams.dispatch(setClubDevice(res.updatedClubDevice));
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
