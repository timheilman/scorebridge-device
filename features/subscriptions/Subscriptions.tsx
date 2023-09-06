import { CONNECTION_STATE_CHANGE, ConnectionState } from "@aws-amplify/pubsub";
import { Hub } from "aws-amplify";
import gql from "graphql-tag";
import { useEffect } from "react";

import { Club } from "../../appsync";
import { logCompletionDecoratorFactory } from "../../scorebridge-ts-submodule/logCompletionDecorator";
import {
  deleteAllSubs,
  typedSubscription,
} from "../../scorebridge-ts-submodule/subscriptions";
import { gqlMutation } from "../../utils/gql";
import { useAppDispatch } from "../../utils/hooks";
import { logFn } from "../../utils/logging";
import { setClub } from "../playerNameEntry/playerNameEntrySlice";

const log = logFn("features.subscriptions.Subscriptions.");
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const lcd = logCompletionDecoratorFactory(log, false);

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

function subscribeAndFetch(clubId: string, appDispatch: any) {
  log("hubListen.connected", "debug");
  typedSubscription<{ updatedClub: Club }>({
    subId: "updatedClub",
    clubId,
    callback: (res) => {
      appDispatch(setClub(res.updatedClub));
    },
    appDispatch,
    clubIdVarName: "id",
  });

  void lcd(fetchRecentData(clubId, appDispatch), "hubListen.subscribeAndFetch");
}
export interface SubscriptionsParams {
  clubId: string;
}
export default function Subscriptions({ clubId }: SubscriptionsParams) {
  const appDispatch = useAppDispatch();

  useEffect(() => {
    log("initialFetch", "debug");
    let priorConnectionState: ConnectionState;
    log("hubListen.api.beforestart", "debug");
    subscribeAndFetch(clubId, appDispatch);

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
            fetchRecentData(clubId, appDispatch),
            "hublisten.api.fetchRecentData",
          );
        }
        priorConnectionState = payload.data.connectionState;
      } else {
        log("hubListen.api.callback.disregardingEvent", "error", { payload });
      }
    });
    return () => {
      deleteAllSubs(appDispatch);
      stopListening();
    };
  }, [appDispatch, clubId]);
  return <></>;
}
