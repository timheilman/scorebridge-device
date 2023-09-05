import { StyleSheet, Text, View } from "react-native";

import i18n from "../i18n";
import { requiredExpoPublicEnvVar } from "../utils/requiredExpoPublicEnvVar";
import IconButton from "./IconButton";

function forDisplay(regToken: string) {
  return regToken.match(/.{1,4}/g)?.join("-");
}
export const RegTokenScreen = (props: {
  regToken: string;
  onPress: () => void;
}) => {
  return (
    <View style={styles.regScreenContainer}>
      <View>
        <Text style={styles.regTokenLabel}>
          {i18n.t("regTokenScreen.description")}
        </Text>
        <Text style={styles.regTokenLabel}>
          {`${i18n.t("regTokenScreen.RegistrationToken")}: ${forDisplay(
            props.regToken,
          )}`}
        </Text>
        <Text style={styles.regTokenLabel}>
          {`${i18n.t(
            "regTokenScreen.AdminPortalUrl",
          )}: ${requiredExpoPublicEnvVar("PORTAL_URL")}`}
        </Text>
      </View>
      <IconButton
        icon="cards-playing"
        label={i18n.t("regTokenScreen.OnboardThisDevice")}
        onPress={props.onPress}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  regScreenContainer: {
    paddingTop: 58,
    alignItems: "center",
    flexDirection: "column",
  },
  regTokenLabel: {
    color: "#fff",
    fontSize: 32,
    marginBottom: 12,
  },
  regTokenValue: {
    color: "#fff",
    fontSize: 48,
    marginBottom: 12,
  },
});
