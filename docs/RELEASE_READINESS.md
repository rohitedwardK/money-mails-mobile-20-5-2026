# Android production release readiness

Updated 2026-09-11. This is a release candidate, not approval to publish.

## Mobile changes

- Android target/compile SDK 36, Build Tools 36.0.0, AGP 8.9.2 and Gradle 8.11.1.
- react-native-pdf pinned to 7.0.5 (PdfiumAndroid 1.0.32); lockfile updated.
- Removed the unused react-native-customized-image-picker dependency. It supplied Fresco
  animated-gif 1.3.0 with a misaligned x86_64 libgifimage.so. Current photo selection uses
  react-native-image-picker; no active picker calls were removed.
- Current version is 1.0.1 (7013). Confirm its version code exceeds the highest in Play Console.
- Email OTP password recovery is implemented in the mobile, backend and web repositories.
  The backend and web changes must be deployed before distributing this mobile build.
  See EMAIL_PASSWORD_RECOVERY.md for the contract, validation and deployment order.
- Release variants load the public `.env.production` file. A Gradle validation task rejects
  missing/non-production API and Bingo URLs, missing Google web client configuration, and
  embedded AWS Places keys. The JavaScript config also rejects a non-production release API.
- Personalization, subcategory-card, and YouTube fallback undefined-symbol crashes fixed.
- Campaign queries are scoped by signed-in account; guests cannot fetch private ticket history.
  Cancellation reaches fetch for campaign reads. Logout and account deletion cancel/clear
  the global query cache and clear native credentials, local session data and Bingo cookies.
- Top-level payout identifiers are also removed from the profile stored in AsyncStorage.
- Signup, verification and listing privacy links now use the app's existing policy URL.
- README now documents the bare React Native release workflow rather than nonexistent Expo scripts.

## Required backend work (not implemented in this mobile-only repository)

1. **Profile completion/address lookup remains a release blocker.** The current screen requires
   AWS autocomplete/place details, but release builds intentionally contain no AWS key.
   The supplied backend contains /api/v1/address/search over its address database.
   Verify coverage and required fields before replacing AWS with that service or implementing
   a proxy. Preserve the existing rule that ZIP/location comes from the selected address.
2. **Password recovery is fixed locally; deployment and live email testing remain required.**
   The new backend uses separate hashed email OTPs, limited attempts, explicit expiry and
   single-use reset tokens. All old recovery routes are blocked. Existing Money Mails JWT
   sessions are revoked on reset. Independent Bingo sessions need separate handling.
3. Confirm token-subject authorization on user UUID routes, Google ID token verification,
   mail HTML SSRF defenses, geo write authorization, and signed Bingo sessions as documented
   in `SECURITY_BACKEND_FOLLOWUPS.md`. Their server behavior has not been verified.

## Required Play Console and device checks

- Supply a working dedicated reviewer account through Play Console App access. Do not put
  real passwords in the repository's listing draft. Confirm Google sign-in works using
  the Play App Signing certificate, not just the upload/debug certificate.
- Provide a public account-deletion request URL that works without installing the app and
  verify deletion of associated backend data. The mobile delete button does not establish
  that an external deletion flow or actual server-side erasure exists.
- Check that the privacy policy loads publicly and reflects the actual sensitive data,
  rewards, advertising and business data-sharing practices. Listing answers marked
  REVIEW REQUIRED are not ready to paste into Play Console.
- Review Bingo rules and production prizes/entry requirements against Play's contests policy.
- Test the signed release on Android 16 and a 16 KB page-size device, including PDF opening,
  signup, Google login, logout/account switching, mail, rewards, deletion and payment return.
- No device was connected during this change. Production data was not modified and nothing
  was uploaded to Google Play.

## Verification

See `.artifacts/fix-tests-rerun.log` for the regression and smoke-test results,
`.artifacts/fix-targeted-lint.log` for focused lint, and `.artifacts/fix-release-build.log`
for the initial Android build attempt. The durable retry log is
`.artifacts/fix-release-verified.log`. Final artifact validation is recorded in
`.artifacts/fix-artifact-validation.json`; APK signature verification is in
`.artifacts/fix-apk-signature.log`.

- Ten mobile tests pass across three suites, including account isolation and email recovery.
- All 38 backend tests pass across five suites, including 12 recovery/login/logging checks.
- Web production build passes with existing project warnings; changed web files pass lint.
- Focused lint passes for the new cache/network code and its tests.
- Previous full mobile lint run reported 42 errors and 482 warnings after backup exclusions
  and hook fixes. Remaining hook-dependency errors are not resolved by the recovery work.
  Changed recovery files pass lint; EmailOtp has one existing inline-style warning.
- Recovery production AAB and APK build succeeded. See .artifacts/email-recovery-release.log.
- All 30 packaged ARM64/x86_64 native libraries pass the 16 KB ELF alignment check.
  The final APK passes 16 KB ZIP alignment and APK signature verification (v2).
- Packaged application ID is `com.moneymails.app`, version code 7013, version name 1.0.1,
  minimum SDK 24 and target/compile SDK 36.
- Negative production configuration test passes: `ENVFILE=.env.example` is rejected by
  `validateProductionConfig` with the expected production API URL error. See
  `.artifacts/fix-production-guard.log`; exit code 1 is expected for this negative test.
- Corrupt global Gradle cache entries exposed by interrupted builds were backed up
  and regenerated; the final release build completed successfully.

The reusable native-library check is:

```powershell
python scripts/check_android_page_sizes.py android/app/build/outputs/bundle/release/app-release.aab
```

This verifies all packaged ARM64/x86_64 ELF LOAD segments. It does not substitute for
APK ZIP alignment checks, on-device tests or Play Console validation.
