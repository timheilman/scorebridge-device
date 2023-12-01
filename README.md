## Welcome to ScoreBridge-Device

In Portland, Oregon, USA there is a [duplicate bridge](https://en.wikipedia.org/wiki/Duplicate_bridge) club run by a guy named Zack.  It is not sanctioned by the [ACBL](https://acbl.org/) and Zack charges no dues – it's purely social and for-fun.  I (Tim) am a club member.  Different club members take turns hosting the game at their homes.

Presently we use Google sheets and extensive macros that Zack has written in them to score the games.  However, it is awkward and error-prone using Google Sheets to enter player identities and scores so I undertook this project to make things easier and less error-prone.

As of December 1, 2023, this project is very much a work-in-progress; it is not yet capable of doing what it intends, which is to replace the Google Sheets and macros. Someday I hope it will be.

The project is in three parts: a [webapp](https://github.com/timheilman/scorebridge-webapp), this device app, and a [cloud backend](https://github.com/timheilman/scorebridge-cloud). The club admin (Zack) uses the webapp to administer the game and players use the device app to enter identities and scores.  This device app is a React Native app using [Expo](https://docs.expo.dev/tutorial/introduction/) that runs on iOS and Android.  The webapp is a React app that runs in a browser. The cloud backend coordinates interaction between the webapp and device app.
