This is a new [**React Native**](https://reactnative.dev) project, bootstrapped using [`@react-native-community/cli`](https://github.com/react-native-community/cli).

# MoneyMails development and Android release

This is a bare React Native app. The committed `android` and `ios` projects
are the native source of truth. Expo/EAS build scripts are not configured.

Install dependencies with `npm ci`, then copy `.env.example` to `.env` for
development. Run `npm start` and `npm run android` to use Metro and a debug build.

Android release builds automatically load `.env.production`, which contains
public endpoints and an OAuth client ID only. Never add signing passwords,
backend secrets, or AWS keys to this file: native config is embedded in the app.
An `ENVFILE` override is validated too; staging and missing production settings
cause release validation to fail.

From the project root in PowerShell:

```powershell
npm.cmd ci
npm.cmd test -- --runInBand
.\android\gradlew.bat -p android :app:bundleRelease
python scripts/check_android_page_sizes.py android/app/build/outputs/bundle/release/app-release.aab
```

The release uses API 36, AGP 8.9.2, Gradle 8.11.1, Java 17, and NDK
27.1.12297006. Install Android SDK Platform 36 and Build Tools 36.0.0.
Configure the existing upload key and credentials in your user Gradle properties;
never commit signing passwords. The generated bundle is
`android/app/build/outputs/bundle/release/app-release.aab`.

The native alignment script checks ARM64 and x86_64 ELF libraries. Also validate
generated APK ZIP alignment and run the release on a 16 KB device before upload.
For iOS, run CocoaPods installation on macOS after dependency changes.

See `docs/RELEASE_READINESS.md` for completed fixes and remaining release gates.

# Getting Started

> **Note**: Make sure you have completed the [Set Up Your Environment](https://reactnative.dev/docs/set-up-your-environment) guide before proceeding.

## Step 1: Start Metro

First, you will need to run **Metro**, the JavaScript build tool for React Native.

To start the Metro dev server, run the following command from the root of your React Native project:

```sh
# Using npm
npm start

# OR using Yarn
yarn start
```

## Step 2: Build and run your app

With Metro running, open a new terminal window/pane from the root of your React Native project, and use one of the following commands to build and run your Android or iOS app:

### Android

```sh
# Using npm
npm run android

# OR using Yarn
yarn android
```

### iOS

For iOS, remember to install CocoaPods dependencies (this only needs to be run on first clone or after updating native deps).

The first time you create a new project, run the Ruby bundler to install CocoaPods itself:

```sh
bundle install
```

Then, and every time you update your native dependencies, run:

```sh
bundle exec pod install
```

For more information, please visit [CocoaPods Getting Started guide](https://guides.cocoapods.org/using/getting-started.html).

```sh
# Using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up correctly, you should see your new app running in the Android Emulator, iOS Simulator, or your connected device.

This is one way to run your app — you can also build it directly from Android Studio or Xcode.

## Step 3: Modify your app

Now that you have successfully run the app, let's make changes!

Open `App.tsx` in your text editor of choice and make some changes. When you save, your app will automatically update and reflect these changes — this is powered by [Fast Refresh](https://reactnative.dev/docs/fast-refresh).

When you want to forcefully reload, for example to reset the state of your app, you can perform a full reload:

- **Android**: Press the <kbd>R</kbd> key twice or select **"Reload"** from the **Dev Menu**, accessed via <kbd>Ctrl</kbd> + <kbd>M</kbd> (Windows/Linux) or <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> (macOS).
- **iOS**: Press <kbd>R</kbd> in iOS Simulator.

## Congratulations! :tada:

You've successfully run and modified your React Native App. :partying_face:

### Now what?

- If you want to add this new React Native code to an existing application, check out the [Integration guide](https://reactnative.dev/docs/integration-with-existing-apps).
- If you're curious to learn more about React Native, check out the [docs](https://reactnative.dev/docs/getting-started).

# Troubleshooting

If you're having issues getting the above steps to work, see the [Troubleshooting](https://reactnative.dev/docs/troubleshooting) page.

# Learn More

To learn more about React Native, take a look at the following resources:

- [React Native Website](https://reactnative.dev) - learn more about React Native.
- [Getting Started](https://reactnative.dev/docs/environment-setup) - an **overview** of React Native and how setup your environment.
- [Learn the Basics](https://reactnative.dev/docs/getting-started) - a **guided tour** of the React Native **basics**.
- [Blog](https://reactnative.dev/blog) - read the latest official React Native **Blog** posts.
- [`@facebook/react-native`](https://github.com/facebook/react-native) - the Open Source; GitHub **repository** for React Native.
