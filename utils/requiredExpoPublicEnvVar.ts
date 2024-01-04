const varsAsWeWantThem: Record<string, string | undefined> = {};
const ALL_REQUIRED_ENV_VARS = [
  "API_URL",
  "AWS_REGION",
  "COGNITO_USER_POOL_CLIENT_ID_CLUB_DEVICE",
  "COGNITO_USER_POOL_ID",
  "PORTAL_URL",
  "STAGE",
];

// the way expo handles env vars requires access via the dot operator, hence this repetition:
varsAsWeWantThem.API_URL = process.env.EXPO_PUBLIC_API_URL;
varsAsWeWantThem.AWS_REGION = process.env.EXPO_PUBLIC_AWS_REGION;
varsAsWeWantThem.COGNITO_USER_POOL_CLIENT_ID_CLUB_DEVICE =
  process.env.EXPO_PUBLIC_COGNITO_USER_POOL_CLIENT_ID_CLUB_DEVICE;
varsAsWeWantThem.COGNITO_USER_POOL_ID =
  process.env.EXPO_PUBLIC_COGNITO_USER_POOL_ID;
varsAsWeWantThem.PORTAL_URL = process.env.EXPO_PUBLIC_PORTAL_URL;
varsAsWeWantThem.STAGE = process.env.EXPO_PUBLIC_STAGE;

ALL_REQUIRED_ENV_VARS.forEach((envVar) => {
  if (varsAsWeWantThem[envVar] === undefined) {
    throw new Error(
      `At startup, EXPO_PUBLIC_${envVar} not defined and patched-through as required by the poor-man's ` +
        `env vars accommodation within expo`,
    );
  }
});
export const requiredExpoPublicEnvVar = (envVar: string) => {
  if (varsAsWeWantThem[envVar] === undefined) {
    throw new Error(
      `At invocation, EXPO_PUBLIC_${envVar} not defined and patched-through as required by the poor-man's ` +
        `env vars accommodation within expo`,
    );
  }
  return varsAsWeWantThem[envVar]!;
};
