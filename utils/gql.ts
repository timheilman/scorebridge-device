import { GraphQLQuery } from "@aws-amplify/api";
import { API, graphqlOperation } from "aws-amplify";

import { AuthModeType } from "../scorebridge-ts-submodule/subscriptions";

export function gqlMutation<OUT>(
  gqlOpString: unknown,
  gqlOpVars: Record<string, unknown> = {},
  authMode?: AuthModeType,
) {
  return API.graphql<GraphQLQuery<OUT>>({
    ...graphqlOperation(gqlOpString, gqlOpVars),
    authMode,
  });
}
