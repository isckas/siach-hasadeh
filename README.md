# Siach HaSadeh Synagogue — website, TV board and board manager

בית כנסת שיח השדה, צמח השדה, מעלה אדומים.

One small static site with three views:

| Address | Who | What |
|---|---|---|
| `/` | Everyone, no login | Bilingual Hebrew/English website: prayer times, zmanim, notices and flyers, community, donations (Bit / PayBox) |
| `/#display` | The shul TV, no login | Full-screen board. Updates by itself within seconds of a save, keeps working offline, reloads nightly at 03:30 (never on Shabbat) |
| `/#manage` | Admins only | Google sign-in. Edit everything, then **Save & publish** |

## Who can sign in

There are no regular user accounts. Sign-in exists only for admins.

* **Owner**: edits content and manages the admin list (Users tab). `isaac.kass@gmail.com` is the built-in owner and can never be locked out.
* **Admin**: edits content.
* Anyone else who signs in with Google sees "This account isn't on the admin list" and can't change anything. This is enforced on the server by `firestore.rules`, not only in the page.

To add a board member: **Manage → Users → Add admin**, enter their Google account email, then choose Admin or Owner. They can sign in right away. Removing someone takes effect immediately, even if they have the page open.

## How it's built

* **Hosting**: GitHub Pages (this repo), free.
* **Data**: Cloud Firestore on the free Spark plan.
  * `site/state`: all content (times, notices, sponsors, mazal tov, etc.), with `rev`, `updatedBy` and `updatedAt`.
  * `images/{id}`: uploaded flyers, compressed in the browser to a JPEG under 1 MB.
  * `admins/{email}`: role `admin` or `owner`.
  * `log/{id}`: who saved what, and when.
* **Sign-in**: Firebase Authentication, Google provider only.
* **Zmanim**: computed in the browser with @hebcal/core for Ma'ale Adumim. No API keys.
* **Concurrent edits**: if two admins edit at once, the second one's draft is merged with the first save field by field, and saving is checked against the revision.

`firebase-config.js` holds the public web config, which is safe to publish. Security comes from `firestore.rules`.

## Setup checklist (one time)

1. Create a Firebase project, then register a Web app and paste its config into `firebase-config.js`.
2. Authentication → Sign-in method → enable **Google**.
3. Authentication → Settings → Authorized domains → add `isckas.github.io` (done).
4. Firestore Database → create (production mode) → Rules → paste `firestore.rules` → Publish.
5. GitHub repo → Settings → Pages → deploy from branch `main`, folder `/`.
6. Open `/#manage`, sign in as the owner, then press **Save & publish** once. This uploads the starting content in `seed/`.

If you add another built-in owner, add them to both `firebase-config.js` (`SHUL_OWNERS`) and `isBuiltInOwner()` in `firestore.rules`. Usually it's simpler to add owners from the Users tab.

## Local testing

```
npx firebase-tools emulators:start --project demo-shul --only auth,firestore
python3 -m http.server 8765
```

Point `firebase-config.js` at the emulator with `window.SHUL_EMULATOR={host:'127.0.0.1',firestore:8080,auth:9099}`.
