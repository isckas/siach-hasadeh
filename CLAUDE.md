# Siach HaSadeh website: standing rules

These hold for every session that works on this repository.

## Design
- Use the design skill (frontend-design) for every visual change, however small.
- The v3 layout is approved. Polish it; don't re-layout it without asking.
- Leave the look of the v1 page (root) and /v2/ as they are. Fixes to the shared engine (app.js) are fine.

## Priorities
- Anything security-related is high priority and is done right away, in its own release if needed: rules, keys, settings, fixes for holes. Don't hold it for the next feature release.
- Features and bug fixes wait for a release: batch them, test, security check, one push.

## Deploying
- No small deploys. Work and test locally, then do one push of all the changes together.
- Before that push, run a security check: an independent review of the code and the Firestore rules, the rules tests and the end-to-end test on the emulator. Don't publish anything with a known hole.
- Pushing to main on this repository is allowed. Don't re-trigger the copy workflow on the shul's account; it runs by itself every hour.
- Publishing firestore.rules to Firebase changes security settings: ask for an explicit OK each time.

## Security setup (Nov 2026)
- App Check with reCAPTCHA (Fraud Defense) key 'Siach HaSadeh website' is registered and in watch-only mode. Enforce it for Firestore once the site and the TV show as verified in the App Check metrics. Before enforcing, start Firestore only after reCAPTCHA has loaded (with a ~10 s fallback), or the first requests go out without a token and are refused.
- The browser API key is restricted to the shul's address, the personal GitHub address, and siach-hasadeh.firebaseapp.com / web.app. A new site address must be added there, to the reCAPTCHA key's domains and to Auth's authorized domains.
- The site is hidden from search engines (noindex on every page; robots.txt keeps /docs/ out, since PDFs can't carry noindex) until the board decides otherwise.
- The reCAPTCHA badge is hidden on v3, the TV and the admin page, which show Google's notice instead; v1 and v2 show the badge.

## Never
- Type passwords, bank, card or account numbers into any field.
- Install the Claude GitHub app on the shul's GitHub account.
- Put a member's name or phone number into site/state. Submissions keep them, readable by admins only, and approval removes them.

## Calendar notes
- Israel (il) calendar, Dati Leumi customs: Hallel with a bracha and no Tachanun on Yom HaAtzmaut and Yom Yerushalayim.
- Hebcal 6.14 gets the edges of Chanukah wrong (Hallel on the eve, half Hallel on Rosh Chodesh Tevet, no Tachanun the day after). app.js seasonal() corrects them.
- Holiday themes switch on at sunset the evening before. Chanukah's starts with the first candle.

## Backlog (v4)
- The v4 list is in V4.md. Add agreed-but-later features there rather than building them now.
