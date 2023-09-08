import SubscriptionsComponent from "../subscriptions/SubscriptionsComponent";
import { PlayerNameEntryScreen } from "./playerNameEntryScreen";

export interface FoundUserScreenParams {
  clubId?: string;
}
export default function FoundUserScreen({ clubId }: FoundUserScreenParams) {
  if (!clubId) {
    throw new Error("clubId should not be null here");
  }

  return (
    <>
      <SubscriptionsComponent clubId={clubId} />
      <PlayerNameEntryScreen />
    </>
  );
}
