import { Amplify, Auth } from "aws-amplify";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import IconButton from "./components/IconButton";
import i18n from "./i18n";
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
// WARNING: do not DRY these out into a single function, as the process by which
// they are included does not tolerate access by variable string; they must be
// accessed this way:
if (!process.env.EXPO_PUBLIC_AWS_REGION) {
  throw new Error("EXPO_PUBLIC_AWS_REGION is not defined");
}
if (!process.env.EXPO_PUBLIC_COGNITO_USER_POOL_ID) {
  throw new Error("EXPO_PUBLIC_COGNITO_USER_POOL_ID is not defined");
}
if (!process.env.EXPO_PUBLIC_COGNITO_USER_POOL_CLIENT_ID_WEB) {
  throw new Error("EXPO_PUBLIC_COGNITO_USER_POOL_CLIENT_ID_WEB is not defined");
}
if (!process.env.EXPO_PUBLIC_API_URL) {
  throw new Error("EXPO_PUBLIC_API_URL is not defined");
}
if (!process.env.EXPO_PUBLIC_STAGE) {
  throw new Error("EXPO_PUBLIC_API_URL is not defined");
}

Amplify.configure({
  API: {
    graphql_headers: async () => {
      try {
        const session = await Auth.currentSession();
        return {
          Authorization: session.getIdToken().getJwtToken(),
        };
      } catch (e) {
        return {};
      }
    },
  },
  Auth: {
    region: process.env.EXPO_PUBLIC_AWS_REGION,
    userPoolId: process.env.EXPO_PUBLIC_COGNITO_USER_POOL_ID,
    userPoolWebClientId:
      process.env.EXPO_PUBLIC_COGNITO_USER_POOL_CLIENT_ID_WEB,
  },
  aws_appsync_graphqlEndpoint: process.env.EXPO_PUBLIC_API_URL,
  aws_appsync_region: process.env.EXPO_PUBLIC_AWS_REGION,
});

export default function App() {
  const [regCode] = useState(regCodeForDisplay());

  // eslint-disable-next-line @typescript-eslint/require-await
  const onDispatchRegisterAsync = async () => {
    Alert.alert(
      "Registering club device...\nTODO: implement gql mutation for this",
    );
  };

  const dispatchRegister = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onDispatchRegisterAsync().catch((e: any) => {
      Alert.alert(
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
