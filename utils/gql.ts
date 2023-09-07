import { GraphQLQuery } from "@aws-amplify/api";
import { API, graphqlOperation } from "aws-amplify";

import { AuthMode } from "../scorebridge-ts-submodule/authMode";

export function gqlMutation<OUT>(
  gqlOpString: unknown,
  gqlOpVars: Record<string, unknown> = {},
  authMode?: AuthMode,
) {
  return API.graphql<GraphQLQuery<OUT>>({
    ...graphqlOperation(gqlOpString, gqlOpVars),
    authMode: authMode || "AMAZON_COGNITO_USER_POOLS",
  });
}
