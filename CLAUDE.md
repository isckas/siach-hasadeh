# Siach HaSadeh website: standing rules

These hold for every session that works on this repository.

## Design
- v3 is the only design: the website (/v3/), the TV screen (/v3/#display) and the admin page (/#manage, styled to match v3). Every address and link opens v3.
- v1 and v2 are retired: / and /v2/ open v3. Don't bring them back, link to them, or test against them.
- Use the design skill (frontend-design) for every visual change, however small.
- The v3 layout is approved. Polish it; don't re-layout it without asking.
- TV cards must use their space evenly: no narrow stacked columns, nothing that leaves a box, every flyer shown whole.
- Fewest taps: every action, above all donating, takes as few taps as possible. A QR code or button goes straight to the payment or page it names, never through an in-between page.
- Two QR codes on the TV always sit in separate places, never next to each other, each with its own label.

## Definition of done (every change, before reporting it as done)
The owner should never have to find a problem first. Before saying something is done:
1. Visual changes go through the design skill.
2. Look at it: screenshots of every affected screen, actually reviewed. TV at 1920x1080 with every text size, Hebrew and English, short and long names, minutes/hours/tomorrow countdowns and Shabbat; the website at phone (360-430px), tablet and desktop with every drawer; the admin page on phone and desktop.
3. Run the automatic layout audits (TV cards, website, admin) so nothing spills, overlaps or gets cut off.
4. Proofread every word, Hebrew and English: meaning, spelling, and the same names the admin page uses.
5. Tests: rules tests, the emulator end-to-end and admin tests, the website/TV suite.
6. Independent security review, then one push.
7. Check it live on every address (siachhasadeh.org, then the shul's github.io copy after the hourly run): website, TV and admin page, console clean.
8. If an admin feature or label changed, update the admins' guide in the same release.
9. Write any new feedback or decision into LEARNINGS.md (standing rules go in this file).
Keep going until it works live; don't stop at "pushed".

## Addresses
- The main address is https://siachhasadeh.org (DNS at Cloudflare). For now it is served from the isckas GitHub repo; once things are stable it moves to the shul's GitHub account in one switch.
- The shul's github.io address is a copy, refreshed every hour.

## Priorities
- Anything security-related is high priority and is done right away, in its own release if needed: rules, keys, settings, fixes for holes. Don't hold it for the next feature release.
- Features and bug fixes wait for a release: batch them, test, security check, one push.

## Deploying
- No small deploys. Work and test locally, then do one push of all the changes together.
- Before that push, run a security check: an independent review of the code and the Firestore rules, the rules tests and the end-to-end test on the emulator. Don't publish anything with a known hole.
- Pushing to main on this repository is allowed. Don't re-trigger the copy workflow on the shul's account; it runs by itself every hour.
- Publishing firestore.rules to Firebase changes security settings: ask for an explicit OK each time.

## Security setup
- This file is served publicly with the site. Keep security configuration details (what is enforced, keys, restrictions) out of it; they live in the Firebase and Google Cloud consoles and in the session notes.
- A new site address must be added to the browser key's website list, the reCAPTCHA key's domains and Auth's authorized domains.
- The reCAPTCHA badge is hidden on v3, the TV and the admin page, which show Google's notice instead.
- The site is kept out of search engines (noindex on every page; robots.txt keeps /docs/ out) until the board decides otherwise.

## Never
- Type passwords, bank, card or account numbers into any field.
- Install the Claude GitHub app on the shul's GitHub account.
- Put a member's name or phone number into site/state. Submissions keep them, readable by admins only, and approval removes them.

## Calendar notes
- Israel (il) calendar, Dati Leumi customs: Hallel with a bracha and no Tachanun on Yom HaAtzmaut and Yom Yerushalayim.
- Hebcal 6.14 gets the edges of Chanukah wrong (Hallel on the eve, half Hallel on Rosh Chodesh Tevet, no Tachanun the day after). app.js seasonal() corrects them.
- Holiday themes switch on at sunset the evening before. Chanukah's starts with the first candle.

## Admins' how-to guide
- The admins have a separate step-by-step guide page that opens admin sections by address (#manage/<section>). When an admin feature, label or section changes, update the guide in the same release, and keep the section ids stable.

## Backlog and learnings
- The v4 list is in V4.md. Add agreed-but-later features there rather than building them now.
- LEARNINGS.md keeps every piece of feedback and what changed because of it. Read it at the start of a session.
