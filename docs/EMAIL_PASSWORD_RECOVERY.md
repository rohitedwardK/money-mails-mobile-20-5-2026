# Email password recovery handoff

Implemented and verified locally on 2026-09-11. Nothing deployed to production or Play.

## Repositories changed

- Mobile: E:/money-mails-mobile-20-5-2026
- Backend: E:/workspace/21-11-25-money-mails/money-mails-backend/money-mails-backend
- Web: E:/workspace/money-mails/14-03-26/money-mails-frontend

Flow: registered email ? emailed OTP ? restricted reset token ? new password ? login.
No full sign-in happens during recovery. Codes and tokens expire after 10 minutes.
The server enforces code attempt limits, request throttling and single-use proof.
No OTP is returned in API responses; reset tokens are excluded from response logs.
Backend JWTs issued before a reset are rejected by the account-version check.

POST /api/v1/user/password-recovery/request accepts {email}.
POST /api/v1/user/password-recovery/verify accepts {email, otp}.
POST /api/v1/user/password-recovery/complete accepts {resetToken, password}.

The old phone/identity recovery and insecure legacy OTP/reset routes return 410.
Both the new mobile reset screen and web /reset-password page use these endpoints.
Password login also accepts a consumer email when older accounts have a phone username.

## Verified

- 10/10 mobile tests pass; 38/38 backend tests pass (12 cover recovery/login/logging).
- Tests use isolated MongoDB and mocked email/Firebase services, not production accounts.
- Changed mobile/web recovery files pass lint; one pre-existing mobile inline-style warning.
- Web production build completes with existing warnings.
- Android AAB and APK built with production configuration: 1.0.1 (7013), API 36.
- All 30 packaged 64-bit native libraries pass 16 KB ELF alignment.
- APK ZIP alignment and signature pass; AAB signature verifies.
- AAB SHA-256: 0f265d7585dd1c64ea94f01c3cfe93ea793344e59ca83e7d3b9ce3161dd7a91a

## Required deployment order

Deploy the backend and matching web change before distributing Android 7013.
Follow docs/EMAIL_PASSWORD_RECOVERY.md in the backend repository for SMTP, secrets,
trusted reverse-proxy addresses, rate-limit TTL index and JWT compatibility details.
The backend lockfile was synchronized with its declared test dependencies and is
now included in source control scope for reproducible installation.

Test real email delivery and recovery using a dedicated account after deployment.
No deployment credentials or production SMTP behavior were verified in this session.
Independent Bingo sessions are not revoked by this backend's JWT version check.

Signup address lookup, other backend authorization findings and outstanding Play
listing/device checks still prevent a public release. Refer to RELEASE_READINESS.md.
