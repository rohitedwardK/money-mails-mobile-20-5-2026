# Repository Guidance

## Active App Targets
- Prefer the `MoneyMails` app targets and paths.
- Android source of truth is under `android/` and `src/`.
- iOS source of truth is under `ios/MoneyMails*`.

## Keep Out Of Default Codex Context
Unless the task explicitly mentions them, do not spend context budget reading, summarizing, or editing these paths and files:

- `node_modules/`
- `.bundle/`
- `.idea/`
- `.vscode/`
- `money-mails-mobile.zip`
- `test.bundle`
- `MoneyMails 2023-07-08 13-09-04/`
- `android/app/src/main/re/`
- `ios/MyApp/`
- `ios/MyApp.xcodeproj/`
- `new.sh`
- `new2.sh`
- `new3.sh`
- `new4.sh`
- `new5.sh`
- `src/screens/Login/SignUp/index-old.js`
- `src/screens/User/Bingo/index-old.js`
- `src/screens/User/Profile/index-old.js`
- `src/screens/User/Home/indexwork.js`
- `src/screens/User/Mails/index22.js`
- `src/screens/User/profileComplete/ProfileSetting/index.style.js 17-05-33-398.js`

## Working Rules
- Prefer active implementations over `*-old.js`, scratch scripts, exported bundles, and generated asset copies.
- For iOS work, start with `ios/MoneyMails.xcodeproj` and `ios/MoneyMails/`. Treat `ios/MyApp*` as legacy unless the task explicitly requires it.
- For Android assets, use `android/app/src/main/res/`. Treat `android/app/src/main/re/` as duplicate/generated noise unless proven otherwise.
- Only pull legacy or duplicate files into context when they are directly needed for recovery, diffing, or migration work.
