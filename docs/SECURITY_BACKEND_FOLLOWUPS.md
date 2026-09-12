# Backend Security Follow-ups

These items cannot be fully resolved in the mobile app alone. Track them with the API/backend team.

| Issue | Required backend change |
|-------|-------------------------|
| `html_url` SSRF | Server-side URL allowlist and no internal-network fetch for `/mail/read/html/file` |
| IDOR on `user_uuid` routes | Authorize by token subject; ignore client-supplied UUID when it does not match the session |
| Unauthenticated geo writes | Require auth and rate limits on `/county` and `/city` |
| Google login | Verify `idToken` signature and audience server-side; do not trust client profile fields alone |
| AWS Places | Proxy autocomplete through `/address/autocomplete`; revoke the mobile Places API key |
| Password reset | Replace phone + ID proof with OTP or signed email reset links |
| Bingo session | Issue a short-lived signed Bingo session token instead of custom-header cookie auth |

## Mobile release ops

- This Play listing is new: keep `android/app/moneymails.keystore` and the upload passwords in `%USERPROFILE%\.gradle\gradle.properties` (never commit passwords).
- After the first AAB upload, losing that keystore blocks updates until Play resets the upload key.
