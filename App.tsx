import { CognitoUser } from "amazon-cognito-identity-js";
import { Amplify, Auth } from "aws-amplify";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { Alert, StyleSheet, Text } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { RegTokenScreen } from "./components/RegTokenScreen";
import {
  randomRegToken,
  regTokenSecretPart,
  regTokenToEmail,
} from "./scorebridge-ts-submodule/regTokenUtils";
import { requiredExpoPublicEnvVar } from "./utils/requiredExpoPublicEnvVar";

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
    region: requiredExpoPublicEnvVar("AWS_REGION"),
    userPoolId: requiredExpoPublicEnvVar("COGNITO_USER_POOL_ID"),
    userPoolWebClientId: requiredExpoPublicEnvVar(
      "COGNITO_USER_POOL_CLIENT_ID_WEB",
    ),
  },
  aws_appsync_graphqlEndpoint: requiredExpoPublicEnvVar("API_URL"),
  aws_appsync_region: requiredExpoPublicEnvVar("AWS_REGION"),
});

export default function App() {
  const [regToken] = useState(randomRegToken());
  const [user, setUser] = useState<undefined | CognitoUser>(undefined);

  // eslint-disable-next-line @typescript-eslint/require-await
  const onDispatchRegisterAsync = async () => {
    const args = {
      username: regTokenToEmail(regToken, requiredExpoPublicEnvVar("STAGE")),
      password: regTokenSecretPart(regToken),
    };
    Alert.alert(`awaiting signin with values ${JSON.stringify(args)}`);
    const user = (await Auth.signIn(args)) as CognitoUser;
    Alert.alert(`done awaiting signin, !!user is ${!!user}`);
    if (user) {
      setUser(user);
    }
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
      {user ? (
        <Text>GOT A USER, YAY!</Text>
      ) : (
        <RegTokenScreen regToken={regToken} onPress={dispatchRegister} />
      )}
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
});
