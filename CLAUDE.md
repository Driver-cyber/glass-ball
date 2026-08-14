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
   the thing that matters. The Opening dashboard deep-links straight into the
   Forge — that's the standard: **one tap from "I opened the app" to "the timer
   is running on my task."**
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

## 🗺 Product Spec — The Five Tabs

**Opening · Calendar · Projects · The Forge · Closing**

### 1. Opening (default on launch)
Today-at-a-glance dashboard: today's glass balls (with their stickers, earned
or pending), rubber balls below, gold-star status. **Tapping any task
deep-links into the Forge with that task loaded and its time block set.** This
is the launch ramp, not a lobby — zero friction between opening the app and
starting work.

### 2. Calendar (the heart)
- Full-month calendar page; dates are tappable cards; defaults to today.
- Gold stars visible on past days where all glass was caught.
- Selecting a date shows that day's lists below the calendar:
  - **Glass list** (max 3) — checkboxes left, CTT check-and-strikethrough
    animation on complete.
  - **Rubber list** (max 5) — same interaction.
  - **Expandable Notes** button below (CTT blueprint pattern) — free brain-dump
    for anything that doesn't fit the lists.
- **Inline task entry**: type into the empty checklist line to add (CTT
  blueprint pattern).
- **Full creation screen**: via a three-dot menu on any task row or the
  plus-circle button top-right of the Calendar. iPhone-Reminders-style form:
  - Name — **the only required field** (plus the day being added to)
  - Date
  - Recurrence: none / daily / weekly / every other week / monthly
  - Priority: glass or rubber
  - Time block: budgeted **minutes** (not a clock time); optional

### 3. Projects
Multi-step, longer-term projects, ported from CTT's projects surface.
**The bridge:** a project step can be pushed onto a calendar day as a glass or
rubber ball, so projects feed the daily game instead of living in a silo.
Bridge polish is backlogged; the v1 port + basic push-to-day comes first.

### 4. The Forge (the workspace)
- **Focus timer** ported from CTT with exactly **two renderers: Moon and pixel
  grid** (hot-swappable, CTT registry pattern).
- Date selector (defaults today) + month report chips + a "Select a task"
  picker window.
- Picking a task from that day's list **auto-loads its time block minutes**
  into the timer.
- Timer: start / pause / stop, custom minutes, reset. **Standalone mode**: the
  timer works decoupled from any task (e.g., expanded without a selection).
- **Start flow:** pressing start pops a wry joke/quote window → user taps
  start again to close it and begin. (Never blocks: closable instantly.)
- **Stop / timeout flow:** always the same two options —
  - **Task complete** → checks it off: popup shows task name + checkbox
    animation + strikethrough + **sticker earned**. From there: X to close, or
    tap complete again for a dry/encouraging closing quote.
  - **Still needs work** → offers +15 / +30 / custom more minutes to continue,
    **or** "Create follow-up" → opens the task creation screen pre-filled from
    the original with "Follow up: " prefixed to the name, so the remainder
    lands somewhere deliberate on the calendar.
- Completing a task via the Forge routes the celebration here (popup), then
  the Closing surface carries the "enough" moment.
- **Month report** (within the Forge): completed tasks vs. budget — ahead or
  behind the assigned time block. Actual time = time elapsed on the timer when
  marked complete. **Deprioritized for initial builds** — mechanism can stub.

### 5. Closing
The celebration and rest surface. Reflects the day's stickers and gold-star
status, asks the quiet question — *have you done enough?* — and points at the
door. Mirror, not wall (CTT principle): it names the impulse to keep going, it
never blocks or nags.

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
   content** added by them — do not ship third-party quotes in code. Meme/image
   support is a parked v2 feature; build the library format so images can slot
   in later.

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

## 🔒 Non-Negotiables

1. **Caps are hard:** 3 glass / 5 rubber per day, enforced in the UI. No
   override setting. The constraint *is* the product.
2. **Rubber never accrues guilt.** No overdue states, red badges, or nag
   surfaces for rubber tasks. Ever.
3. **No secrets in either repo.** KV worker credentials/config live in the
   worker environment, entered/managed at runtime — repos stay safely public.
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

- **Phase 0 — Scaffold & Port:** Both repos created; cream/black shell with
  five tabs; CTT components ported and de-CTT'd; storage module + schema +
  `normalize()` in place with the sync seam stubbed. *(Chad wires the KV
  worker in parallel.)*
- **Phase 1 — The Heart:** Calendar (month view, day cards, glass/rubber
  lists, notes, inline + full task creation, recurrence); Opening dashboard
  with the Forge deep-link; KV sync live across both surfaces.
- **Phase 2 — The Game:** Forge full flow (task picker, time-block auto-load,
  start joke, complete/still-needs-work/follow-up); stickers, gold stars,
  completion celebration; Closing surface.
- **Parked:** month report analytics, meme/image joke library, Projects↔
  Calendar bridge polish, additional timer renderers, anything else that
  surfaces (→ `DECISIONS.md` parking lot).

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
