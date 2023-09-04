import { StyleSheet, Text, View } from "react-native";

import i18n from "../i18n";
import IconButton from "./IconButton";

export function RegTokenScreen(props: {
  regToken: string | undefined;
  onPress: () => void;
}) {
  return (
    <View style={styles.regScreenContainer}>
      <View>
        <Text style={styles.regTokenLabel}>{i18n.t("regTokenLabel")}</Text>
        <Text style={styles.regTokenValue}>{props.regToken}</Text>
      </View>
      <IconButton
        icon="cards-playing"
        label="Register Club Device"
        onPress={props.onPress}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  regScreenContainer: {
    paddingTop: 58,
    alignItems: "center",
    flexDirection: "column",
  },
  regTokenLabel: {
    color: "#fff",
    marginBottom: 12,
  },
  regTokenValue: {
    color: "#fff",
    fontSize: 24,
    marginBottom: 12,
  },
});
