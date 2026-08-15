# Glass Ball Cloud Sync — Cloudflare KV setup

This is a one-time setup. It stands up a tiny Cloudflare Worker + KV store that
holds Joelle's Glass Ball data so it syncs across her phone, laptops, and
browsers. The data lives in **your** Cloudflare account; the secret lives only
on her devices and in Cloudflare — never in the app's code or this repo.

**This is Glass Ball's own Worker + namespace + secret** — completely separate
from Chiaro Tinker Tools' sync. Her data never meets Chad's: different Worker,
different KV namespace, different `SYNC_SECRET`, different sync-code prefix
(`GLASS1-`).

**Before anything, once the app holds real data: gear ⚙ → "Export backup."**
Keep that `.json` somewhere safe. It's the parachute.

---

## 1. Create the KV namespace
Cloudflare dashboard → **Storage & Databases → KV → Create a namespace**.
- Name: `glass-ball-sync`
- Create. (That's it — no keys to add; the app fills it.)

## 2. Create the Worker
Cloudflare dashboard → **Workers & Pages → Create → Workers → Create Worker**.
- Name it `glass-ball-sync` (its URL becomes `https://glass-ball-sync.<you>.workers.dev`).
- **Edit code**, delete the starter, and paste the entire contents of
  [`glass-sync-worker.js`](./glass-sync-worker.js).
- **Deploy**.

## 3. Bind the KV namespace + set the secret
Open the Worker → **Settings**.
- **Bindings → Add → KV namespace:**
  - Variable name: `GLASS_KV`  (exactly this)
  - KV namespace: `glass-ball-sync` (the one from step 1)
- **Variables and Secrets → Add → type "Secret":**
  - Name: `SYNC_SECRET`
  - Value: a **new** long random passphrase (30+ chars from a password
    manager). Never reuse CTT's secret. **Save this** — you'll paste the same
    value in the app.
- **Deploy** again so the binding + secret take effect.

## 4. Get the URL
On the Worker's page, copy its URL: `https://glass-ball-sync.<you>.workers.dev`.

## 5. Connect the app
In the app: **gear ⚙ → Cloud Sync**:
- Paste the **Worker URL** and the **SYNC_SECRET** → **Connect**.
- **Create my journal** (uploads the current data). The app then shows a
  **Sync code** (`GLASS1-…`).
- On another device: paste that one **Sync code** → it connects, joins, and
  pulls in a single step. Turn on **Auto-sync**.

---

### Notes
- **Auth:** every request carries the secret in an `X-Sync-Secret` header;
  without it the Worker returns 401. CORS is open so the Pages site can call it.
- **Privacy:** the blob is stored as plaintext JSON in your KV. Fine for a
  single-user setup; at-rest encryption can be layered on later at the same
  seam. **If you use the ball pit (v0.8.0)**, two journals share one Worker and
  one `SYNC_SECRET` — so either could read the other's journal given its ID.
  That's a deliberate choice between Chad and Joelle (the pit is partly *for*
  that transparency); it is not a setup to hand to anyone else.
- **Cost:** comfortably inside Cloudflare's free tier for one person.
- **Conflict handling:** the *journal* uses last-write-wins by edit time and
  warns on a manual push if the cloud copy changed underneath. The *ball pit*
  deliberately does not: two people write it, so it merges item by item
  (newer edit wins per ball, tombstones for deletes). That merge is convergent,
  so the pit never shows a conflict dialog and cannot drop a ball.

## 6. (Optional) The ball pit
A shelf shared between two journals on the same Worker.
- One of you: gear ⚙ → **The ball pit** → put your name in, name the pit,
  **Start a pit**. Copy your **Sync code**.
- The other: paste that Sync code in Cloud Sync. It carries both a journal and
  a pit, so the app asks which it is — choose **"It's my partner's"** to join
  the pit only and keep your own board. Then set your own name on the pit.
- Its KV key is `journal:pit:<id>`; leaving the pit never touches balls already
  on anyone's days.
