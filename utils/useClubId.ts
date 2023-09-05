import { CognitoUser } from "amazon-cognito-identity-js";
import { useState } from "react";

import { logFn } from "./logging";
const log = logFn("utils.useClubId");
export const useClubId = (user: CognitoUser) => {
  const [tenantId, setTenantId] = useState<string>();
  user.getUserAttributes((err, result) => {
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
    setTenantId(local);
  });
  return tenantId;
};
