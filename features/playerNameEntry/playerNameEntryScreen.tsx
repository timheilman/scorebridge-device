import { CognitoUser } from "amazon-cognito-identity-js";
import { StyleSheet, Text } from "react-native";

import { useAppSelector } from "../../utils/hooks";
import { useClubId } from "../../utils/useClubId";
import Subscriptions from "../subscriptions/Subscriptions";
import { selectSubscriptionById } from "../subscriptions/subscriptionsSlice";
import { selectClub } from "./playerNameEntrySlice";

export interface PlayerNameEntryScreenParams {
  user: CognitoUser;
}
export function PlayerNameEntryScreen({ user }: PlayerNameEntryScreenParams) {
  const club = useAppSelector(selectClub);
  const clubSubStatus = useAppSelector(selectSubscriptionById("updatedClub"));
  const clubId = useClubId(user);

  return (
    <>
      {clubId ? <Subscriptions clubId={clubId} /> : ""}
      <Text style={styles.container}>
        Does a text imported from react-native here? My club&apos;s name is
        {" " + club.name}; my subscription status is {clubSubStatus}
      </Text>
    </>
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
