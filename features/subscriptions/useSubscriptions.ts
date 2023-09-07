import { CONNECTION_STATE_CHANGE, ConnectionState } from "@aws-amplify/pubsub";
import { Hub } from "aws-amplify";
import gql from "graphql-tag";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

import { Club } from "../../scorebridge-ts-submodule/graphql/appsync";
import { logCompletionDecoratorFactory } from "../../scorebridge-ts-submodule/logCompletionDecorator";
import {
  deleteAllSubs,
  typedSubscription,
} from "../../scorebridge-ts-submodule/subscriptions";
import { gqlMutation } from "../../utils/gql";
import { logFn } from "../../utils/logging";
import { setClub } from "../playerNameEntry/playerNameEntrySlice";

const log = logFn("features.subscriptions.Subscriptions.");
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const lcd = logCompletionDecoratorFactory(log, false);

/* eslint-disable @typescript-eslint/no-explicit-any,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-assignment */
const fetchRecentData = async (dispatch: any, clubId: string) => {
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

function subscribeAndFetch(dispatch: any, clubId: string) {
  log("hubListen.connected", "debug");
  typedSubscription({
    subId: "updatedClub",
    clubId,
    callback: (res) => {
      log("typedSubscription.updatedClubCallback", "debug", { res });
      dispatch(setClub(res.updatedClub));
    },
    dispatch,
    clubIdVarName: "id",
  });

  void lcd(fetchRecentData(dispatch, clubId), "hubListen.subscribeAndFetch");
}

export default function useSubscriptions(clubId: string) {
  const dispatch = useDispatch();
  useEffect(() => {
    log("initialFetch", "debug");
    let priorConnectionState: ConnectionState;
    log("hubListen.api.beforestart", "debug");
    subscribeAndFetch(dispatch, clubId);

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
            fetchRecentData(dispatch, clubId),
            "hublisten.api.fetchRecentData",
          );
        }
        priorConnectionState = payload.data.connectionState;
      } else {
        log("hubListen.api.callback.disregardingEvent", "error", { payload });
      }
    });
    return () => {
      deleteAllSubs(dispatch);
      stopListening();
    };
  }, [dispatch, clubId]);
}
