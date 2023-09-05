const varsAsWeWantThem: Record<string, string | undefined> = {};

varsAsWeWantThem["AWS_REGION"] = process.env.EXPO_PUBLIC_AWS_REGION;
varsAsWeWantThem["COGNITO_USER_POOL_ID"] =
  process.env.EXPO_PUBLIC_COGNITO_USER_POOL_ID;
varsAsWeWantThem["COGNITO_USER_POOL_CLIENT_ID_WEB"] =
  process.env.EXPO_PUBLIC_COGNITO_USER_POOL_CLIENT_ID_WEB;
varsAsWeWantThem["API_URL"] = process.env.EXPO_PUBLIC_API_URL;
varsAsWeWantThem["STAGE"] = process.env.EXPO_PUBLIC_STAGE;
export const requiredExpoPublicEnvVar = (key: string) => {
  if (varsAsWeWantThem[key] === undefined) {
    throw new Error(
      `EXPO_PUBLIC_${key} not defined and patched-through as required by the poor-man's ` +
        `env vars accommodation within expo`,
    );
  }
  return varsAsWeWantThem[key] as string;
};
