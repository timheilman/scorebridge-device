import { CONNECTION_STATE_CHANGE, ConnectionState } from "@aws-amplify/pubsub";
import { Hub } from "aws-amplify";
import gql from "graphql-tag";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

import { Club } from "../../scorebridge-ts-submodule/graphql/appsync";
import { logCompletionDecoratorFactory } from "../../scorebridge-ts-submodule/logCompletionDecorator";
import {
  AccessParams,
  deleteAllSubs,
  generateTypedSubscription,
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

function subscribeToAll(dispatch: any, clubId: string) {
  log("hubListen.connected", "debug");
  const accessParams: AccessParams = { dispatch, clubId };
  generateTypedSubscription(
    accessParams,
    "updatedClub",
    (res) => {
      log("typedSubscription.updatedClubCallback", "debug", { res });
      dispatch(setClub(res.updatedClub));
    },
    "id",
  );
}

export default function useSubscriptions(clubId: string) {
  const dispatch = useDispatch();
  useEffect(() => {
    log("useEffect", "debug");
    let priorConnectionState: ConnectionState;
    log("hubListen.api.beforestart", "debug");
    subscribeToAll(dispatch, clubId);

    log("hubListen.api.before", "debug");
    const stopListening = Hub.listen("api", (data: any) => {
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
        log("hubListen.api.callback.disregardingEvent", "debug", { payload });
      }
    });
    return () => {
      deleteAllSubs(dispatch);
      stopListening();
    };
  }, [clubId, dispatch]);
}
