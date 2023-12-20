import { Wifi, WifiOff } from "react-native-feather";

import OnlineStatus from "../../scorebridge-ts-submodule/OnlineStatus";
import SubscriptionsComponent from "../subscriptions/SubscriptionsComponent";
import TableNumberForm from "../tableNumberEntry/TableNumberForm";

export interface FoundUserScreenParams {
  clubId?: string;
  clubDeviceId?: string;
}
export default function FoundUserScreen({
  clubId,
  clubDeviceId,
}: FoundUserScreenParams) {
  if (!clubId || !clubDeviceId) {
    throw new Error("neither clubId nore clubDeviceId should be null here");
  }

  return (
    <>
      <SubscriptionsComponent clubId={clubId} clubDeviceId={clubDeviceId} />
      <OnlineStatus
        subscriptionIds={["updatedClub", "updatedClubDevice"]}
        upIcon={<Wifi fill="white" stroke="white" />}
        downIcon={<WifiOff fill="white" stroke="white" />}
      />
      <TableNumberForm clubId={clubId} clubDeviceId={clubDeviceId} />
    </>
  );
}
