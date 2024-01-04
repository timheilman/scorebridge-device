import "expo-dev-client";
import "react-native-get-random-values"; // trying to fix subscription errors

import { Amplify } from "aws-amplify";
import { fetchAuthSession, signIn, signOut } from "aws-amplify/auth";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { Alert, StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Provider as ReactReduxProvider } from "react-redux";

// import { PersistGate } from "redux-persist/integration/react";
import { RegTokenScreen } from "./components/RegTokenScreen";
import FoundUserScreen from "./features/playerNameEntry/FoundUserScreen";
import {
  randomRegToken,
  regTokenSecretPart,
  regTokenToEmail,
} from "./scorebridge-ts-submodule/regTokenUtils";
import { requiredExpoPublicEnvVar } from "./utils/requiredExpoPublicEnvVar";
import { store } from "./utils/store";

Amplify.configure(
  {
    API: {
      GraphQL: {
        endpoint: requiredExpoPublicEnvVar("API_URL"),
        region: requiredExpoPublicEnvVar("AWS_REGION"),
        defaultAuthMode: "userPool",
      },
    },
    Auth: {
      Cognito: {
        userPoolClientId: requiredExpoPublicEnvVar(
          "COGNITO_USER_POOL_CLIENT_ID_CLUB_DEVICE",
        ),
        userPoolId: requiredExpoPublicEnvVar("COGNITO_USER_POOL_ID"),
      },
    },
  },
  {
    API: {
      GraphQL: {
        headers: async () => {
          try {
            const session = await fetchAuthSession();
            return {
              Authorization: session?.tokens?.idToken?.toString(),
            };
          } catch (e) {
            return {};
          }
        },
      },
    },
  },
);

export default function App() {
  const [regToken] = useState(randomRegToken());
  const [user, setUser] = useState<
    undefined | { clubId: string; clubDeviceId: string }
  >(undefined);

  const onDispatchRegisterAsync = async () => {
    // Alert.alert(`awaiting signin with values ${JSON.stringify(args)}`);
    await signOut();
    const signInOutput = await signIn({
      username: regTokenToEmail(regToken, requiredExpoPublicEnvVar("STAGE")),
      password: regTokenSecretPart(regToken),
      options: { authFlowType: "USER_PASSWORD_AUTH" },
    });
    // Alert.alert(`done awaiting signin, !!user is ${!!user}`);
    if (signInOutput.isSignedIn) {
      const { tokens } = await fetchAuthSession();
      const idToken = tokens?.idToken;
      if (!idToken) {
        throw new Error(
          "Unable to find idToken from amplify v6 fetchAuthSession",
        );
      }
      //       dispatch(setCognitoGroups(idToken.payload["cognito:groups"] as string[]));
      //       dispatch(setClubId(idToken.payload["custom:tenantId"] as string));
      setUser({
        clubDeviceId: idToken.payload.sub!,
        clubId: idToken.payload["custom:tenantId"] as string,
      });
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
            clubId={user.clubId}
            clubDeviceId={user.clubDeviceId}
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
