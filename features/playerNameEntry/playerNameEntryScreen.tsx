import { StyleSheet, Text } from "react-native";

import { useAppSelector } from "../../utils/hooks";
import { selectClub } from "./playerNameEntrySlice";

export function PlayerNameEntryScreen() {
  const club = useAppSelector(selectClub);
  return (
    <Text style={styles.container}>
      Does a text imported from react-native here? My club&apos;s name is
      {" " + club.name}
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
