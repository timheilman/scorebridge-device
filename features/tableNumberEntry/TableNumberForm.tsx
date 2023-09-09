import React, { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { logCompletionDecoratorFactory } from "../../scorebridge-ts-submodule/logCompletionDecorator";
import { MaybeFooterElement } from "../../scorebridge-ts-submodule/MaybeFooterElement";
import { gqlMutation } from "../../utils/gql";
import { useAppSelector } from "../../utils/hooks";
import i18n from "../../utils/i18n";
import { logFn } from "../../utils/logging";
import { setTableNumberGql } from "./gql/setTableNumber";
import { selectClubDevice } from "./tableNumberEntrySlice";
export interface TableNumberFormParams {
  clubId: string;
  clubDeviceId: string;
}
const log = logFn("src.features.tableNumberEntry.TableNumberForm.");
const lcd = logCompletionDecoratorFactory(log, true, "debug", "error");
export default function TableNumberForm({
  clubId,
  clubDeviceId,
}: TableNumberFormParams) {
  const [submitInFlight, setSubmitInFlight] = useState(false);
  const [everSubmitted, setEverSubmitted] = useState(false);
  const [errStr, setErrStr] = useState<string | null>(null);
  const [tableNumberText, setTableNumberText] = useState("");
  const tableNumberCloud = useAppSelector(selectClubDevice)?.table;
  // const updatedClubDeviceStatus = useAppSelector(
  //   selectSubscriptionStateById("updatedClubDevice"),
  // ) as string;
  useEffect(() => {
    setTableNumberText(tableNumberCloud?.toString() ?? "");
  }, [tableNumberCloud]);
  const parsedTableNumber = (tableNumberText: string) => {
    try {
      return Number.parseInt(tableNumberText);
    } catch (e) {
      log("parsedTableNumber.notANumber", "error", e);
      return 0;
    }
  };
  const tableNumber = parsedTableNumber(tableNumberText);

  const handleSubmit = () => {
    setSubmitInFlight(true);
    setEverSubmitted(true);
    try {
      void lcd(
        gqlMutation(setTableNumberGql, {
          input: { clubId, clubDeviceId, table: tableNumber },
        }),
        "setTableNumber",
      );
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (e.message) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument,@typescript-eslint/no-unsafe-member-access
        setErrStr(e.message);
      } else {
        setErrStr(`${e}`);
      }
    }
    setSubmitInFlight(false);
  };
  const handleChangeTableNumber = (newText: string) => {
    setTableNumberText(newText);
  };

  return (
    <>
      <View style={styles.tableNumberContainer}>
        {/*<Text style={{ fontSize: 24, color: "#fff" }}>*/}
        {/*  sub status: {updatedClubDeviceStatus}*/}
        {/*</Text>*/}
        <Text style={styles.barelyLegible}>
          {i18n.t("tableNumberForm.current")} {tableNumberCloud}
        </Text>
        <Text style={styles.barelyLegible}>
          {i18n.t("tableNumberForm.tableNumber.label")}
        </Text>
        <TextInput
          style={[styles.barelyLegible, styles.inputField]}
          placeholder="        "
          onChangeText={handleChangeTableNumber}
          defaultValue={tableNumberText}
          data-test-id="formSetTableNumberTableNumber"
        />
        <Pressable
          style={styles.button}
          disabled={
            submitInFlight ||
            !tableNumberText ||
            !tableNumberText.match(/^[0-9]{1,3}$/)
          }
          onPress={handleSubmit}
        >
          <Text style={styles.barelyLegible}>
            {i18n.t("tableNumberForm.submit")}
          </Text>
        </Pressable>
      </View>
      <MaybeFooterElement
        everSubmitted={everSubmitted}
        submitInFlight={submitInFlight}
        errStr={errStr}
        submitInFlightElt={
          <Text style={styles.barelyLegible}>setting table number...</Text>
        }
        errElt={
          <Text style={styles.barelyLegible}>
            Problem with last submission: <pre>{errStr}</pre>
          </Text>
        }
        successElt={
          <Text style={styles.barelyLegible}>table number changed!</Text>
        }
      />
    </>
  );
}
const styles = StyleSheet.create({
  myInputWidth: {
    width: "85%",
  },
  tableNumberContainer: {
    paddingTop: 58,
    alignItems: "center",
    flexDirection: "column",
  },
  barelyLegible: {
    color: "#fff",
    fontSize: 48,
    marginBottom: 12,
  },
  inputField: {
    backgroundColor: "#666",
  },
  button: {
    backgroundColor: "green",
  },
});
