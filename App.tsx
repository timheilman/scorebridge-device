import { Amplify, Auth } from "aws-amplify";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { Alert, StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Provider as ReactReduxProvider } from "react-redux";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// import { PersistGate } from "redux-persist/integration/react";
import { RegTokenScreen } from "./components/RegTokenScreen";
import { DiscoveredSignInResponseUserType } from "./features/playerNameEntry/DiscoveredSignInResponseUserType";
import FoundUserScreen from "./features/playerNameEntry/FoundUserScreen";
import {
  randomRegToken,
  regTokenSecretPart,
  regTokenToEmail,
} from "./scorebridge-ts-submodule/regTokenUtils";
import { requiredExpoPublicEnvVar } from "./utils/requiredExpoPublicEnvVar";
import { store } from "./utils/store";
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
      "COGNITO_USER_POOL_CLIENT_ID_CLUB_DEVICE",
    ),
  },
  aws_appsync_graphqlEndpoint: requiredExpoPublicEnvVar("API_URL"),
  aws_appsync_region: requiredExpoPublicEnvVar("AWS_REGION"),
});

export default function App() {
  const [regToken] = useState(randomRegToken());
  const [user, setUser] = useState<
    undefined | DiscoveredSignInResponseUserType
  >(undefined);

  // eslint-disable-next-line @typescript-eslint/require-await
  const onDispatchRegisterAsync = async () => {
    const args = {
      username: regTokenToEmail(regToken, requiredExpoPublicEnvVar("STAGE")),
      password: regTokenSecretPart(regToken),
    };
    Alert.alert(`awaiting signin with values ${JSON.stringify(args)}`);
    const user = (await Auth.signIn(args)) as DiscoveredSignInResponseUserType;
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
    <ReactReduxProvider store={store}>
      {/*<PersistGate>*/}
      <GestureHandlerRootView style={styles.container}>
        {user ? (
          <FoundUserScreen
            clubId={user.attributes["custom:tenantId"]}
            clubDeviceId={user.attributes["sub"]}
          />
        ) : (
          <RegTokenScreen regToken={regToken} onPress={dispatchRegister} />
        )}
        <StatusBar style="auto" />
      </GestureHandlerRootView>
      {/*</PersistGate>*/}
    </ReactReduxProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#25292e",
    alignItems: "center",
  },
});
