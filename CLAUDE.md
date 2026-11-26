# Siach HaSadeh website: standing rules

These hold for every session that works on this repository.

## Design
- Use the design skill (frontend-design) for every visual change, however small.
- The v3 layout is approved. Polish it; don't re-layout it without asking.
- Leave the look of the v1 page (root) and /v2/ as they are. Fixes to the shared engine (app.js) are fine.

## Deploying
- No small deploys. Work and test locally, then do one push of all the changes together.
- Before that push, run a security check: an independent review of the code and the Firestore rules, the rules tests and the end-to-end test on the emulator. Don't publish anything with a known hole.
- Pushing to main on this repository is allowed. Don't re-trigger the copy workflow on the shul's account; it runs by itself every hour.
- Publishing firestore.rules to Firebase changes security settings: ask for an explicit OK each time.

## Never
- Type passwords, bank, card or account numbers into any field.
- Install the Claude GitHub app on the shul's GitHub account.
- Put a member's name or phone number into site/state. Submissions keep them, readable by admins only, and approval removes them.

## Calendar notes
- Israel (il) calendar, Dati Leumi customs: Hallel with a bracha and no Tachanun on Yom HaAtzmaut and Yom Yerushalayim.
- Hebcal 6.14 gets the edges of Chanukah wrong (Hallel on the eve, half Hallel on Rosh Chodesh Tevet, no Tachanun the day after). app.js seasonal() corrects them.
- Holiday themes switch on at sunset the evening before. Chanukah's starts with the first candle.

## Backlog (v4)
- Links to the shul's Facebook and Twitter.
