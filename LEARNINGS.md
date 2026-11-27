# Siach HaSadeh: feedback and what we learned

Every piece of feedback from the owner, newest first, with what changed because of it. Read this at the start of every session so nothing has to be said twice. Standing rules that come out of it live in CLAUDE.md.

## How to work
- Be proactive. The owner should not have to babysit: find problems before they do, finish the job end to end, and check it live before reporting back. (CLAUDE.md, "Definition of done".)
- Don't stop at "pushed". Keep going until the live address works.
- Use the design skill for everything visual, and proofread every screen visually, not just in code.
- Write feedback down here and in CLAUDE.md instead of relying on memory.
- Use APIs where they are reachable; don't ask for secret tokens to be pasted into chat for one-off setup.
- Anything security-related is done right away; features and fixes go out in one tested release.

## 2026-11-27
- **Kiddush invitation** should show only when a Kiddush is planned (v4; see V4.md).
- **v3 everywhere.** The new domain showed the old v1 page. v3 is the website, the screen and the admin look; every internal link points to v3. v1 and v2 are retired and taken offline (/ and /v2/ open v3).
- **Main address: siachhasadeh.org.** Bought at Cloudflare; served from the isckas GitHub repo for now, one switch to the shul's account later.
- **TV next-tefillah card.** The time stuck out of the navy box, and later a long name was squeezed into a narrow stacked column. Now: label and countdown on the top line, the name across the full width, the time below. Layouts must stay balanced at every text size and name length.
- **Flyers on the TV were cut off at the bottom.** Found by the new layout audit. Flyers always show whole.
- **Admin publish bar.** After publishing it still said there were unpublished changes, because the live database returns fields in its own order. Content is now compared field by field in a fixed order.
- **Prayer times from the printed weekly sheet** (Vayishlach): weekday Shacharit 7:00 and 7:45 (the second is entered as the Sephardi minyan), Arvit 21:00, Daf Yomi 20:15 Sun–Thu and 15:15 on Shabbat, Shabbat Shacharit 8:30, Mincha & Kabbalat Shabbat 20 min after candle lighting, Shabbat Mincha 35 min before sunset, Arvit Motzei Shabbat 3 min before Shabbat ends rounded down to 5.
- **Directions:** the parking lot is behind Super Sapir (it used to be Yeinot Bitan).
- **Admins' how-to guide** is a separate interactive page that opens admin sections directly; it is updated with every admin change.

## 2026-11-26
- **Admin page redesign** to match v3 and be as simple as possible; the admins start using it now, so it shouldn't change under them later.
- **Shul screen link removed from the website.** The screen address is shown to admins in the admin page instead.
- **Search engines:** the site stays hidden (no-index) until the board decides.
- **Welcome message for new admins** and **sign-in lower on the page** are v4 items (V4.md).
- **Rosh Hashana theme:** the shofar drawing was redrawn so it reads clearly as a shofar.
