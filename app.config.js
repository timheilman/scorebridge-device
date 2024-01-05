const IS_DEV = process.env.APP_VARIANT === "dev";
export default {
  expo: {
    name: IS_DEV ? "Scorebridge8ForClubs (Dev)" : "Scorebridge8ForClubs",
    slug: "scorebridge-device",
    version: "1.0.0",
    orientation: "landscape",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#25292e",
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      // bundleIdentifier: IS_DEV
      //   ? "com.scorebridge8.dev.scorebridgedevice"
      //   : "com.scorebridge8.scorebridgedevice",
      supportsTablet: true,
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      package: IS_DEV
        ? "com.scorebridge8.dev.scorebridgedevice"
        : "com.scorebridge8.scorebridgedevice",
    },
    web: {
      favicon: "./assets/favicon.png",
    },
    plugins: ["expo-localization"],
    extra: {
      eas: {
        projectId: "446c6f00-35d3-4803-8db5-da84e8991bf5",
      },
    },
  },
};
