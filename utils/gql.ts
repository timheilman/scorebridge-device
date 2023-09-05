import { GraphQLQuery } from "@aws-amplify/api";
import { API, graphqlOperation } from "aws-amplify";

export function gqlMutation<OUT>(
  gqlOpString: unknown,
  gqlOpVars: Record<string, unknown> = {},
) {
  const authMode: { authMode: "AMAZON_COGNITO_USER_POOLS" | "API_KEY" } = {
    authMode: "AMAZON_COGNITO_USER_POOLS",
  };
  return API.graphql<GraphQLQuery<OUT>>({
    ...graphqlOperation(gqlOpString, gqlOpVars),
    ...authMode,
  });
}
