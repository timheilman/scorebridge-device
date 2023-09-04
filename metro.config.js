// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require("expo/metro-config");
const defaultSourceExts =
  require("metro-config/src/defaults/defaults").sourceExts;
const sourceExts = [
  "jsx",
  "js",
  "ts",
  "tsx",
  "json",
  "svg",
  "d.ts",
  "mjs",
].concat(defaultSourceExts);

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

module.exports = { ...config, resolver: { sourceExts } };
