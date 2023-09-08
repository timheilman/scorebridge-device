import { StyleSheet, Text } from "react-native";

import { selectSubscriptionStateById } from "../../scorebridge-ts-submodule/subscriptionStatesSlice";
import { useAppSelector } from "../../utils/hooks";
import useSubscriptions from "../subscriptions/useSubscriptions";
import { DiscoveredSignInResponseUserType } from "./DiscoveredSignInResponseUserType";
import { selectClub } from "./playerNameEntrySlice";

export interface PlayerNameEntryScreenParams {
  user: DiscoveredSignInResponseUserType;
}
export function PlayerNameEntryScreen({ user }: PlayerNameEntryScreenParams) {
  /* eslint-disable @typescript-eslint/ban-ts-comment,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment */
  // @ts-ignore
  const clubId = user.attributes["custom:tenantId"];
  /* eslint-enable @typescript-eslint/ban-ts-comment,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment */
  const club = useAppSelector(selectClub);
  if (!clubId) {
    throw new Error(
      `No clubId found for clubDevice user ${JSON.stringify(user, null, 2)}`,
    );
  }
  useSubscriptions(clubId);
  const clubSubStatus = useAppSelector(
    selectSubscriptionStateById("updatedClub"),
  ) as string;

  return (
    <Text style={styles.container}>
      Does a text imported from react-native here? My club&apos;s name is
      {" " + club.name}; my subscription status is {clubSubStatus}
    </Text>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#25292e",
    paddingTop: 580,
    alignItems: "center",
    color: "#fff",
  },
});
