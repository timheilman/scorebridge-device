import { CognitoUser } from "amazon-cognito-identity-js";

import { logFn } from "./logging";
const log = logFn("utils.useClubId.");
export const useClubId = (user: CognitoUser) => {
  log("useClubId", "debug");
  user.getUserAttributes((err, result) => {
    log("getUserAttributes", "debug");
    if (err) {
      log("getUserAttributes.err", "error", err);
    }
    if (!result) {
      log("getUserAttributes.noresult", "error");
      return;
    }
    const local = result
      .find((v) => v.getName() === "custom:tenantId")
      ?.getValue();
    if (!local) {
      throw new Error("No custom:tenantId attribute found");
    }
    log("returningLocal", "debug", local);
    return local;
  });
};
