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
      <SubscriptionsComponent clubId={clubId} />
      <TableNumberForm clubId={clubId} clubDeviceId={clubDeviceId} />
    </>
  );
}
