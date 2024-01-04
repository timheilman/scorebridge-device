## Welcome to ScoreBridge-Device

Please read the [scorebridge-ts-submodule README](https://github.com/timheilman/scorebridge-ts-submodule/blob/main/README.md) for important context regarding this project.

## Installation/deployment instructions

With the upgrade to amplify-js v6, Expo Go no longer functions, so this project uses eas development builds. Production builds have not yet been attempted.

`eas build -p android --profile dev` should start a build on the EAS servers. Once complete I use the camera on an android tablet to scan the QR code and install the development build app. This must be redone whenever a new `npm install` command is performed.

`npx expo start` should start the expo server. Because `expo-dev-client` is a dependency, it should start in development server mode, not Expo Go mode. It will provide a new QR code which can be scanned and copy-pasted into the dialog box that appears when the development build app is started.

`eas build -p android --profile preview` should build an APK file without the `expo-dev-client` activated; this will be a production build but only for internal distribution. Instead, an AAB must be built for the Google Play Store; this has not yet been attempted.

## package.json and .nvmrc commentary

Node is pinned to version 18.13.0 and npm to 9.7.1 simply to maintain
consistency with the webapp repo, which pins to these versions for its
own reasons.
