import { GraphQLSubscription } from "@aws-amplify/api";
import { CONNECTION_STATE_CHANGE, ConnectionState } from "@aws-amplify/pubsub";
import { API, graphqlOperation, Hub } from "aws-amplify";
import gql from "graphql-tag";
import { useEffect } from "react";

import { Club } from "../../appsync";
import { logCompletionDecoratorFactory } from "../../scorebridge-ts-submodule/logCompletionDecorator";
import { gqlMutation } from "../../utils/gql";
import { useAppDispatch } from "../../utils/hooks";
import { logFn } from "../../utils/logging";
import { setClub } from "../playerNameEntry/playerNameEntrySlice";
import {
  allSubscriptionsI,
  setSubscriptionStatus,
  subIdToSubGql,
} from "./subscriptionsSlice";

const log = logFn("features.subscriptions.Subscriptions.");
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const lcd = logCompletionDecoratorFactory(log, false);

const deleteSub = (
  subscriptions: Record<string, unknown>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dispatch: any,
  subId: keyof allSubscriptionsI,
) => {
  if (subscriptions[subId]) {
    log("deleteSub.foundSubId", "debug", { subId });
    /* eslint-disable @typescript-eslint/no-unsafe-call */
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    subscriptions[subId].unsubscribe();
    /* eslint-enable @typescript-eslint/no-unsafe-call */
    delete subscriptions[subId];
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    dispatch(setSubscriptionStatus([subId, "disconnected"]));
  }
  log("deleteSub.noSuchSubId", "debug", { subId });
};

/* eslint-disable @typescript-eslint/no-explicit-any,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-assignment */
const fetchRecentData = async (clubId: string, dispatch: any) => {
  // Retrieve some/all data from AppSync
  return gqlMutation<Club>(
    gql`
      query getClub($clubId: String!) {
        getClub(clubId: $clubId) {
          name
        }
      }
    `,
    {
      clubId,
    },
  ).then((res) => {
    if (res.errors) {
      throw new Error(JSON.stringify(res.errors, null, 2));
    }
    if (!res.data) {
      throw new Error("no gql response data");
    }
    const d = (res.data as unknown as { getClub: Club }).getClub;
    log("dispatchingSetClub", "debug", { res });
    log("dispatchingSetClub.data.getClub", "debug", {
      it: JSON.stringify(d, null, 2),
    });
    dispatch(setClub(d));
  });
};

function subscribeAndFetch(
  typedSubscription: <T>(
    subId: keyof allSubscriptionsI,
    clubId: string,
    callback: (arg0: T) => void,
    errCallback: (arg0: unknown) => void,
    clubIdVarName?: string,
  ) => void,
  clubId: string,
  dispatch: any,
) {
  log("hubListen.connected", "debug");
  typedSubscription<{ updatedClub: Club }>(
    "updatedClub",
    clubId,
    (res) => {
      dispatch(setClub(res.updatedClub));
    },
    (e: any) => {
      dispatch(
        setSubscriptionStatus([
          "updatedClub",
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
          `failed post-initialization: ${e.error.errors[0].message}`,
        ]),
      );
    },
    "id",
  );

  void lcd(fetchRecentData(clubId, dispatch), "hubListen.subscribeAndFetch");
}
export interface SubscriptionsParams {
  clubId: string;
}
export default function Subscriptions({ clubId }: SubscriptionsParams) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const pool: Record<string, unknown> = {};

    log("initialFetch", "debug");
    let priorConnectionState: ConnectionState;
    const typedSubscription = <T,>(
      subId: keyof allSubscriptionsI,
      clubId: string,
      callback: (arg0: T) => void,
      errCallback: (arg0: unknown) => void,
      clubIdVarName = "clubId",
    ) => {
      try {
        deleteSub(pool, dispatch, subId);
        log("subs.deletedAndSubscribingTo", "debug", { subId, clubId });
        if (!pool[subId]) {
          const variables: Record<string, unknown> = {};
          variables[clubIdVarName] = clubId;
          pool[subId] = API.graphql<GraphQLSubscription<T>>({
            authMode: "AMAZON_COGNITO_USER_POOLS",
            ...graphqlOperation(subIdToSubGql[subId], variables),
          }).subscribe({
            next: (data) => {
              if (!data.value?.data) {
                log("subscribeTo.noData", "error", { data });
                return;
              }
              log("subScribeTo.end.success", "info", { data });
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              callback(data.value.data);
            },
            error: (e) => {
              errCallback(e);
            },
          });
        }
        dispatch(setSubscriptionStatus([subId, "successfullySubscribed"]));
      } catch (e: any) {
        if (e.message) {
          dispatch(
            setSubscriptionStatus([
              subId,
              // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
              `failed at initialization: ${e.message}`,
            ]),
          );
        } else {
          dispatch(
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            setSubscriptionStatus([subId, `failed at initialization: ${e}`]),
          );
        }
        return;
      }
    };
    log("hubListen.api.beforestart", "debug");
    subscribeAndFetch(typedSubscription, clubId, dispatch);

    log("hubListen.api.before", "debug");
    const stopListening = Hub.listen("api", (data: any) => {
      // log("hubListen.api.callback", "error", { data });
      const { payload } = data;
      if (payload.event === CONNECTION_STATE_CHANGE) {
        if (
          priorConnectionState === ConnectionState.Connecting &&
          payload.data.connectionState === ConnectionState.Connected
        ) {
          void lcd(
            fetchRecentData(clubId, dispatch),
            "hublisten.api.fetchRecentData",
          );
        }
        priorConnectionState = payload.data.connectionState;
      } else {
        log("hubListen.api.callback.disregardingEvent", "error", { payload });
      }
    });
    return () => {
      Object.keys(subIdToSubGql).forEach((subId: string) => {
        deleteSub(
          pool,
          dispatch,
          subId as keyof allSubscriptionsI /* actually safe */,
        );
      });
      stopListening();
    };
  }, [dispatch, clubId]);
  return <></>;
}
