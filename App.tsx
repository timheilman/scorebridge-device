import * as Localization from "expo-localization";
import { StatusBar } from "expo-status-bar";
import { I18n } from "i18n-js";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import IconButton from "./components/IconButton";
import { translations } from "./locales/localization";
const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
function randomRegCode() {
  return [...Array(16).keys()]
    .map(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      (_s) => {
        return characters.charAt(Math.floor(Math.random() * characters.length));
      },
    )
    .join("");
}

function regCodeForDisplay() {
  return randomRegCode()
    .match(/.{1,4}/g)
    ?.join("-");
}

export default function App() {
  const [regCode] = useState(regCodeForDisplay());
  const [locale] = useState(Localization.locale);
  const i18n = new I18n(translations);
  i18n.locale = locale;
  i18n.enableFallback = true;
  i18n.defaultLocale = "en";
  const t = i18n.t;
  // eslint-disable-next-line @typescript-eslint/require-await
  const onDispatchRegisterAsync = async () => {
    alert("Registering club device...\nTODO: implement gql mutation for this");
  };

  const dispatchRegister = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onDispatchRegisterAsync().catch((e: any) => {
      alert(
        `Error: ${
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          e?.message ? e.message : e
        }`,
      );
    });
  };
  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.regScreenContainer}>
        <View>
          <Text style={styles.regCodeLabel}>{i18n.t("regCodeLabel")}</Text>
          <Text style={styles.regCodeValue}>{regCode}</Text>
        </View>
        <IconButton
          icon="cards-playing"
          label="Register Club Device"
          onPress={dispatchRegister}
        />
      </View>
      <StatusBar style="auto" />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#25292e",
    alignItems: "center",
  },
  regScreenContainer: {
    paddingTop: 58,
    alignItems: "center",
    flexDirection: "column",
  },
  regCodeLabel: {
    color: "#fff",
    marginBottom: 12,
  },
  regCodeValue: {
    color: "#fff",
    fontSize: 24,
    marginBottom: 12,
  },
});
