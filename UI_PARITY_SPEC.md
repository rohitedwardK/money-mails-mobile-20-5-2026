# UI Parity Spec (mobile -> web)

This short spec locks the parity contract between the web frontend and the mobile app.

## Theme tokens (source of truth)
- Primary accent: `--app-accent` -> `#4EA838` (mobile: `src/utils/colors.js` accent)
- Background / surfaces: `--app-bg` -> mobile `bgPrimary` (`src/utils/colors.js`)
- Primary font family: `Nunito Sans` (web) -> mobile uses system; add typography constants as next step
- Text hierarchy: `fontPrimary`, `fontPrimaryInvert` (mobile tokens in `src/utils/colors.js`)

Reference (mobile): [src/utils/colors.js](src/utils/colors.js)

Acceptance: Login, Home and Rewards screens must use the above accent, background and primary text colors.

## Brand browsing UX
- Web behavior: horizontal, compact carousel / snapping for quick brand discovery.
- Mobile current: vertical wrapped list (see `src/screens/User/Home/index.js` — `barndList?.map(...)`).
- Parity contract: replace the wrapped vertical mapping with a horizontal `FlatList` / carousel. Keep existing semantics:
  - Tapping toggles selection and calls `onBrandSelect( selected, uuid )`.
  - Double-tap (or heart action) toggles favourite via `onFavouriteToggle(brand_uuid)`.
  - Keep the `View more brands` navigation to `Store` route.

Reference (mobile): [src/screens/User/Home/index.js](src/screens/User/Home/index.js#L1040-L1065)

Acceptance: brand row scrolls horizontally with snapping; selection and favorite behavior unchanged.

## Mail viewer behavior matrix
Priority when rendering a mail from OfferCard/Open action:
1. `video_url` -> embed using WebView (or native player)
2. `text/html` -> fetch HTML body and render via WebView
3. `application/pdf` -> render via PDF viewer
4. `image/*` -> render image
5. fallback -> show "No preview available"

Current mobile gaps:
- `requestMailHtml` currently requires `mime_type === 'text/html' && image_url` to set `mailURL` (see `src/screens/User/Home/index.js`), which is brittle.
- Mail HTML fetch exists in `src/hooks/services/useMail.js` (POST `/mail/read/html/file`) and `useMail` builds headers from `UserContext` token — keep this, but ensure the HTML request is triggered whenever `text/html` or when `video_url` is absent and `html` is available.

Acceptance: mobile viewer follows the matrix above and does not gate HTML rendering on presence of `image_url`.

Reference (mobile):
- Home mail render: [src/screens/User/Home/index.js](src/screens/User/Home/index.js#L560-L620)
- Offer card MIME checks: [src/components/organisms/OfferCard/index.js](src/components/organisms/OfferCard/index.js#L1-L120)
- HTML fetch & auth: [src/hooks/services/useMail.js](src/hooks/services/useMail.js#L1-L120)

## Auth & service behavior
- `useMail` must always attach `x-auth-token` from `UserContext.userDetails.token` (already implemented in `useMail.buildHeaders`).
- Normalize token presence (fail fast + retry): add a guard/refresh path if token missing or 401 is returned.

Acceptance: HTML fetch, redeem, favorite, unsubscribe, and mail open flows should not fail due to missing token during active session.

## Unsubscribe parity
- Mobile already calls `/mail/unsubscribe` via `useMail` and provides UI in the mail viewer (`Unsubscribe` button).

Acceptance: user can unsubscribe and the mail list refreshes to reflect the change.

## Next concrete steps (order)
1. Create `UI_PARITY_SPEC.md` (this file) — done.
2. Implement horizontal brand `FlatList` in `src/screens/User/Home/index.js` (1 day).
3. Harden `requestMailHtml` logic and update `OfferCard`/viewer to follow render priority (2 days).
4. Add token retry/refresh behavior in service layer (1 day).
5. UX regression + polish (1 day).

If you want, I can start with item (2) now and replace the wrapped brand list with a horizontal `FlatList` + snapping while preserving selection/favourite actions.
