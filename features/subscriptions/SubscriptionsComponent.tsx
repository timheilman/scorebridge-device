import { Club } from "../../scorebridge-ts-submodule/graphql/appsync";
import {
  AccessParams,
  generateTypedSubscription,
  useSubscriptions,
} from "../../scorebridge-ts-submodule/subscriptions";
import { gqlMutation } from "../../utils/gql";
import { logFn } from "../../utils/logging";
import { setClub } from "../playerNameEntry/playerNameEntrySlice";
import { getClubGql } from "./gql/getClub";
const log = logFn("src.features.subscriptions.SubscriptionComponent.");
export interface SubscriptionComponentParams {
  clubId: string;
}
export default function SubscriptionsComponent({
  clubId,
}: SubscriptionComponentParams) {
  const fetchRecentData = async ({ dispatch, clubId }: AccessParams) => {
    // Retrieve some/all data from AppSync
    return gqlMutation<Club>(getClubGql, {
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
    });
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
  }
  useSubscriptions(clubId, subscribeToAll, fetchRecentData, () => {
    setClub(null);
  });
  return null;
}
