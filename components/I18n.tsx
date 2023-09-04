import "intl-pluralrules";

import i18next, { LanguageDetectorAsyncModule } from "i18next";
import React from "react";
import { initReactI18next, useTranslation } from "react-i18next";
import { Text, TouchableOpacity, View } from "react-native";

// @ts-ignore
import en from "../assets/locales/en/translation.json";
const languageDetector: LanguageDetectorAsyncModule = {
  type: "languageDetector",
  async: true,
  detect: (cb) => cb("en"),
  init: () => {},
  cacheUserLanguage: () => {},
};

i18next
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    debug: true,
    resources: {
      en: {
        translation: en,
      },
    },
  })
  .catch((e) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    alert(`Language Error: ${e?.message ? e.message : e}`);
  });
