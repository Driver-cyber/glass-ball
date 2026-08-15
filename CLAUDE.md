# CLAUDE.md — The Glass Ball

*Project constitution. Read this first, every session. Then read `DECISIONS.md`
and `glass-ball-tracker.html` for current state and priorities.*

---

## 🌟 North Star

**The Glass Ball exists so Joelle never drops what actually matters — and never
feels guilty about what bounces.**

This is Joelle's task and schedule app, sibling to Chiaro Tinker Tools. Where
CTT is about *setting work down*, Glass Ball is about *catching the right
things*. The core metaphor is the juggler's: **glass balls** are tasks with
real consequences if dropped (school enrollment before the deadline); **rubber
balls** feel urgent but bounce back fine tomorrow (the dishes). Most task apps
treat every item as glass. That's the lie this app refuses to tell.

The caps are the philosophy: **max 3 glass balls per day, max 5 rubber.** Three
glass balls makes "what actually matters today" a bounded, winnable game.
Everything rubber is explicitly *allowed to bounce* — no shame mechanics, no
overdue-task guilt piles. When the glass is caught, the day is won. Stickers,
gold star, done. Rest.

Success looks like Joelle closing the app mid-afternoon with three stickers and
zero nagging feeling that she should be doing more.

## 🤹 The Juggler's Test (design lens for every feature)

For every screen, tool, and feature, answer two questions:

1. **Does it help catch glass?** Fewer taps between opening the app and doing
   the thing that matters. The app opens on Today with her balls already in
   front of her, and a ball is one tap from its three verbs — that's the
   standard: **from "I opened the app" to "the timer is running on my ball"
   in two taps, from anywhere.**
2. **Does it let rubber bounce guiltlessly?** No feature may punish, badge,
   redden, or pile up uncompleted rubber tasks. Incomplete rubber is a neutral
   fact, not a failure state.

If a feature can't answer both, it probably doesn't earn its place. When
proposing new features, state both answers explicitly.

## 🚫 Anti-Engagement Ethos (inherited from CTT)

Glass Ball measures itself by how good it feels to *leave*. The Closing surface
— "you've done enough, go rest" — is a first-class feature, not an afterthought.
Never add streaks, daily-use pressure, or anything that rewards opening the app
for its own sake. The gamification celebrates *completion*, never *engagement*.

---

## 👥 The People

- **Joelle** — primary user and **design authority**. She and Chad are
  co-designing. Her taste wins ties on anything visual or interactive. Open
  design questions get logged in `DECISIONS.md` parking lot as "pending Joelle"
  rather than decided unilaterally.
- **Chad** — builder, product partner, and infrastructure owner. He wires the
  Cloudflare KV worker and sync plumbing personally; Claude Code builds against
  the seam he provides.

---

## 🗺 Product Spec — Three Rooms

**Today · Projects · Closing** — plus two utilities in the header (⏳ the
focus timer, ✎ Dev Notes) and the gear ⚙ for sync, the joke library, backup,
and the guide.

*Revised 2026-08-15 (v0.7.0).* The founding spec had five tabs — Opening,
Calendar, Projects, The Forge, Closing. Opening and Calendar turned out to
render the same day twice, and the Forge was a room you travelled to in order
to do a thing you'd already chosen. See `DECISIONS.md` for the full rationale.

### 1. Today (default on launch) — the glance *and* the month
One surface, one scroll:
- **The glance** — "Your Saturday, August 15 at a glance": sticker slots,
  gold-star / settled banner, today's glass (max 3) and rubber (max 5) lists,
  and the ✎ notes drawer. This is the launch ramp, not a lobby.
- **The month** below it — a full month of tappable day cards, gold stars on
  the days where all glass was caught. Planning sits *below* the work.
- **The day you tap** opens in a framed panel beneath the calendar, clearly a
  different place — so "today" never moves out from under her. Tapping Today
  closes it again.
- **Inline entry** on every list (type into the empty line to add), and a
  **+** for the full iPhone-Reminders-style form: name (the only required
  field), day, priority, time block in minutes, recurrence.

### 2. The ball sheet — one tap, three verbs
Tapping anywhere on a ball opens a sheet naming it, with:
- **▶ Start it** — loads its time block and runs the timer
- **✓ Catch it** — done (un-catch if already caught)
- **→ Move it forward** — didn't finish; hand it to another day
- **✎ Edit details**, and a quiet delete

**The one exception: the checkbox stays a direct tap on the row.** Catching is
the most frequent act and the best feeling in the app — it never gets buried.

### 3. Projects
Multi-step, longer-term things, ported from CTT's projects surface.
**The bridge:** a project step can be pushed onto a day as a glass or rubber
ball; catching that ball checks the step back home.

### 3b. The ball pit (v0.8.0) — a shelf two journals share
A collapsed section below the month on Today, and the app's only multi-person
surface.
- **The undated default (v0.9.0):** the creation form opens with **no day**.
  Leave it empty and the ball parks in the pit ("Park it in the pit" is the
  save button); pick a date — or tap the **today** chip — and it **skips the
  pit entirely**. The shelf exists even solo, as the app's parking lane.
- **Two lanes, chosen at creation (v0.9.0):** 🤝 **shared** (the default once
  a pit is joined) or 🔒 **just mine**. Private items never enter the pit's
  KV upload — they ride only the journal blob across your own devices. Lanes
  can be toggled later; shared→private confirms first and retracts the shared
  copy with a tombstone.
- **Park a ball** with no day at all — the brain dump for "this matters, I
  don't know when yet." Scheduling it later is a deliberate act (a Friday
  planning pass, say), not a nag.
- **Take one** onto a day — through the ordinary creation form, and therefore
  through the ordinary **hard caps**. A full day refuses a shared ball.
- **Whoever catches it, catches it for both.** The other side's copy closes on
  its next sync, signed with who caught it.
- **Ask for help asynchronously.** Chad and Joelle are often too busy to
  explain a task out loud; a ball on the shelf is the explanation.
- **It is a shelf, never an inbox.** Collapsed by default, no badge, no count
  on Today. You go and look at it; it never taps you on the shoulder. That
  restraint is what lets it exist in an app built to be left.

### 4. The focus timer (a mode, not a room)
- Reachable from **⏳** in the header or **▶** on any ball. Runs in an overlay
  over whatever room she's in.
- Exactly **two renderers: Moon and pixel grid** (hot-swappable, CTT registry
  pattern). Start / pause / stop / custom minutes / reset. **Standalone mode**
  works with no ball attached.
- **A timer bar** rides along the bottom while a block runs, from any room.
  Closing the face never stops the clock; tapping the bar reopens it.
- **Start flow:** a wry joke/quote window → tap again to begin. Never blocks.
- **Stop / timeout flow:** always two options —
  - **Task complete** → celebration: name + check animation + strikethrough +
    **sticker earned**; tap complete again for a dry, encouraging closing line.
  - **Still needs work** → +15 / +30 / custom, **or** "Create follow-up" →
    the creation form pre-filled with "Follow up: " so the remainder lands
    somewhere deliberate.
- Survives iOS discarding the backgrounded PWA (wall-clock `endAt` kept in a
  device-local key, never synced).

### 5. Closing
The celebration and rest surface. The day's stickers and gold-star status, the
quiet question — *have you done enough?* — and a pointer at the door. Mirror,
not wall: it names the impulse to keep going, it never blocks or nags. The
**month report** (caught balls vs. their time blocks) lives here.

---

## 🏅 Gamification Rules (exact)

1. Each **glass ball** completed earns a **sticker** for that day. Visible on
   the task line and the day.
2. A day holds up to **3 sticker slots**. If a day has fewer than 3 glass
   balls, the remaining sticker(s) are granted when the **last** glass ball of
   that day is completed. (Two glass balls → third sticker arrives with the
   second completion.)
3. All glass complete → the day earns a **gold star**, shown on the Calendar
   and Opening surfaces, persistent across past days.
4. Rubber balls get the satisfying check animation but **no stickers, no
   penalties, no visual debt** when skipped.
5. **Jokes/quotes**: one on timer start (sarcastic-about-work flavor), one on
   the second "complete" tap (dry but genuinely encouraging). v1 is **text
   only**. Claude Code ships the mechanism + a starter library of cultural
   aphorisms and original wry lines. The show-quote library (Arcane, Friends,
   Star Wars, I Think You Should Leave, SNL bits) is **Chad/Joelle-curated
   content** added by them — do not ship third-party quotes in code, ever.
   **Memes shipped in v0.3.0** (was a parked v2 item): images are pasted,
   dragged, or picked into the in-app library, downscaled to 480px JPEG, and
   held under a hard ~1.2MB cap with a visible meter — because the whole db
   is one synced blob, image weight is sync bandwidth and iOS storage. Pasted
   image *addresses* are stored as links instead (free, but they can go dead).
   If the library ever outgrows the cap, the escape hatch is hosted images
   (Cloudflare R2/Images) or a second KV key — not a bigger blob.
6. **Shared balls (the pit, v0.8.0): everyone involved gets a sticker.**
   Catching a ball fills a real slot exactly as always. If someone *else*
   catches a ball you put in the pit, you earn a **bonus sticker** — a small
   **rainbow star ★** (gradient clipped to the glyph; dashed-gold fallback),
   rendered **outside the three slots** and deliberately **outside the
   gold-star test**. So a day can show more than three stickers while
   never holding more than three glass balls, and ★ keeps meaning "every
   glass ball on my day, caught." Markers mirror real state; a gift is drawn
   as a gift.

---

## 🎨 Design Language

- **Background:** white with *just a little* cream — softens the glare of pure
  white without reading warm or yellow. Target neighborhood: `#FBFAF6`. Not
  CTT's chiaroscuro; not the house walnut. This app lives in daylight.
- **Text:** black. High contrast, effortless legibility.
- **Type:** functional and easy to read, with a little more personality than a
  pure utility face. Candidate direction (pending Joelle — log the pick in
  `DECISIONS.md`): **Atkinson Hyperlegible**, **Karla**, or **Alegreya Sans**
  for body/UI; pair with a modest display face only if the design earns it.
- **Classic at the baseline, fun in the moments.** The calm cream-and-black
  shell earns the joy: check animations, stickers, gold stars, joke popups.
  Delight is concentrated at completion moments, not sprinkled as decoration.
- **Glass vs. rubber must be visually distinct at a glance** — treatment
  pending Joelle (subtle glassy sheen vs. matte is one direction). Never rely
  on color alone.
- Mobile-first layouts in the mobile repo; desktop-comfortable in main.
- This app has its **own design language**. The house walnut/amber/Fraunces
  system applies only to `glass-ball-tracker.html`, never to the app itself.

---

## 🛠 Tech Stack & Architecture (with rationale)

- **Two repos, CTT pattern:**
  - `Driver-cyber/glass-ball` — main repo, desktop-browser primary.
  - `Driver-cyber/glass-ball-mobile` — iPhone-primary surface (Joelle's daily
    driver).
  - Both deploy via **Cloudflare Pages** auto-deploy from `main`.
- **Single-file vanilla HTML/CSS/JS** (`src/index.html` or root `index.html`
  per repo) — house default. No framework, no build step: makes Pages deploys
  bulletproof and the whole app greppable. Reach for more only if genuinely
  warranted, and propose first.
- **Ported CTT components** (new repo, not a fork): blueprint-style day lists
  + inline entry, check/strikethrough animation, Moon + pixel-grid timer
  renderers + hot-swap registry, projects surface. Port deliberately — copy
  the component, strip CTT-specific state, rename storage touchpoints.
- **Storage & sync:**
  - `localStorage` under a **new Glass Ball-specific key** (never reuse CTT's).
  - **Cloudflare KV worker sync from day one** — Chad wires the worker
    (step-one, in parallel with the scaffold). Claude Code builds the storage
    layer **against the sync seam from the first commit**: a single storage
    module boundary through which all reads/writes pass, so KV sync attaches
    without refactoring.
  - `SCHEMA_VERSION` + `normalize()` on load (house pattern) — every schema
    change bumps the version and extends `normalize()` so old data always
    upgrades cleanly. Forward-compatible from commit one.
  - Both repos share one schema and one KV namespace — the two surfaces are
    views of the same data.
  - **Two sync algorithms, on purpose (v0.8.0).** A *journal* is one person's
    document, so blob last-write-wins is right for it. The *pit* is two
    people's document, where LWW silently drops whichever save lost the race —
    so the pit merges **per item** (union ids, newer `lastEdit` wins,
    tombstones for deletes). That merge is **convergent**: both sides land on
    identical state whatever order they sync in, so the pit needs no conflict
    dialog and cannot lose a ball. It has its own test suite, run against both
    repos' copies. Never "simplify" the pit onto LWW.

## 🔒 Non-Negotiables

1. **Caps are hard:** 3 glass / 5 rubber per day, enforced in the UI. No
   override setting. The constraint *is* the product.
2. **Rubber never accrues guilt.** No overdue states, red badges, or nag
   surfaces for rubber tasks. Ever.
3. **No secrets in either repo.** KV worker credentials/config live in the
   worker environment, entered/managed at runtime — repos stay safely public.
   Note the v0.8.0 posture change, made knowingly by Chad: sharing a pit means
   sharing one `SYNC_SECRET` across two journals, so each could read the
   other's journal given its ID. Between Chad and Joelle that transparency is
   a *feature* (see the pit). It is not a default to extend to anyone else.
4. **All storage I/O goes through the storage module.** No direct
   `localStorage` calls scattered in feature code — the sync seam depends on it.
5. **`SCHEMA_VERSION` + `normalize()`** on every load; never ship a schema
   change without them.
6. **Joke popups never block.** Instantly closable/skippable, always.
7. **No third-party quotes or IP shipped in code.** Mechanism + original
   content only; curated show quotes are user-added data.
8. **Joelle's design call wins ties.** Unsettled visual/interaction questions
   go to the parking lot as "pending Joelle," not to a unilateral default.

---

## 📅 Phases

- **Phase 0 — Scaffold & Port** *(done, v0.1.0)*: Both repos created; the
  cream/black shell; CTT components ported and de-CTT'd; storage module +
  schema + `normalize()` with the sync seam. *(Chad wired the KV worker in
  parallel.)*
- **Phase 1 — The Heart** *(done, v0.1–0.2)*: month view, day cards,
  glass/rubber lists, notes, inline + full task creation, recurrence; the
  glance dashboard; KV sync live across both surfaces.
- **Phase 2 — The Game** *(done, v0.2–0.4)*: full timer flow (ball picker,
  time-block auto-load, start joke, complete / still-needs-work / follow-up);
  stickers, gold stars, completion celebration; Closing surface.
- **Phase 3 — Hers to use** *(v0.5–0.7, current)*: the scrollytelling guide,
  carry-forward, Dev Notes, the meme library, and the v0.7.0 navigation
  refactor — three rooms, the ball sheet, the timer as a mode. Goal: hand
  Joelle a finished app to live in for a week and return notes.
- **Phase 4 — Shared (v0.8–0.9)**: the ball pit. The first multi-person
  surface: a shelf two journals share, an item-level convergent merge under
  it, bonus stickers, and async "here's what I need help with."
- **Parked:** month report analytics, Projects↔Calendar bridge polish,
  additional timer renderers, anything else that surfaces
  (→ `DECISIONS.md` parking lot).

Phase transitions are **red team gates** (see Maintenance).

---

## 🧠 Memory & Strategy

- **Read first, every session:** this file → `DECISIONS.md` → the tracker.
- **Check the tracker:** Read `glass-ball-tracker.html` for current priorities
  before starting work. Update it at the end of any session that changes
  priorities.
- **Measure twice:** Before any multi-file or multi-step change, propose a
  plan and wait for explicit approval ('y' / 'go'). Chad works in bursts —
  reconstruct context from the docs at each session start rather than assuming
  continuity.
- **Are we pivoting?** If a request contradicts the docs or prior code, ask
  before refactoring.
- **Token thrift:** Ask for specific file paths rather than scanning
  recursively. Targeted greps over full reads. Confirm scope before lengthy
  output.
- **Structured feedback:** Chad tests and returns numbered notes — treat them
  as the precise primary input for the next iteration.
- **Terminal comfort:** Moderate. Number any CLI/deploy steps. Don't
  over-explain product concepts — Chad and Joelle know the domain.

## 📝 Maintenance Rules

- **Log changes:** After a major decision or pivot, ask: "Should I update
  DECISIONS.md?" Convert relative dates to absolute (YYYY-MM-DD).
- **Build tracker:** Update `glass-ball-tracker.html` at the end of sessions
  that complete or change priorities — both the visual board and the JSON
  block, including the `updated` date in both places.
- **Red team triggers:** at every phase gate; after ~2–3 completed features;
  at the first session after a significant time gap. Argue *against* recent
  decisions; land each on **Confirmed / Revised / Scheduled**.
- **Context reset:** Suggest `/clear` when conversation history exceeds ~20
  messages.

---

*Founded 2026-08-14 in a planning session with Claude (claude.ai). Sibling to
Chiaro Tinker Tools. Built by Chad, for Joelle, co-designed by both.*

**Catch the glass. Let the rubber bounce.**
