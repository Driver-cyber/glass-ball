# 🗺 The Glass Ball — Project Evolution & Decision Log

> **Note to Claude:** This project is iterative. Reference this log to
> understand the current vibe before suggesting changes. `CLAUDE.md` holds the
> principles; this file holds the running state.

## 🎯 The North Star (Current Goal)
* **Goal:** Joelle's daily task & schedule app built on the glass/rubber
  priority metaphor — catch what matters (max 3 glass balls/day), let the rest
  bounce guilt-free. Sibling to CTT.
* **Vibe:** Co-design with Joelle. Classic calm base (cream-white/black), fun
  concentrated at completion moments. Ship the heart (Calendar) before the
  game (stickers/jokes).

## 🛠 Active Tech Stack
* **Repos:** `Driver-cyber/glass-ball` (main, desktop-primary) +
  `Driver-cyber/glass-ball-mobile` (iPhone-primary) — CTT two-repo pattern
* **App:** Single-file vanilla HTML/CSS/JS per repo, no framework, no build
* **Hosting:** Cloudflare Pages auto-deploy from `main` (both repos)
* **Storage:** `localStorage` (new Glass Ball key) behind a single storage
  module; `SCHEMA_VERSION` + `normalize()` from commit one
* **Sync:** Cloudflare KV worker from day one — Chad wires the worker; app
  built against the sync seam from the first commit; one schema + one KV
  namespace shared by both surfaces

## 📝 Change Log (Pivots & Decisions)

* **[2026-08-14]:** Project founded (planning session, claude.ai).
    * *Decision:* New repos porting CTT components — not a fork. Port list:
      blueprint day lists + inline entry, check/strikethrough animation, Moon
      + pixel-grid timer renderers with hot-swap registry, projects surface.
    * *Decision:* Two-repo pattern (`glass-ball` + `glass-ball-mobile`)
      matching CTT; Joelle iPhone-primary but desktop built from day one.
    * *Decision:* KV worker sync from day one. Chad sets up the worker as
      step one, in parallel with Claude Code's Phase 0 scaffold.
    * *Decision:* Five tabs — Opening, Calendar, Projects, The Forge, Closing.
      Opening is the launch default and deep-links tasks straight into the
      Forge (one tap from open to timer running).
    * *Decision:* Hard caps: 3 glass / 5 rubber per day. No override. Rubber
      never accrues guilt states.
    * *Decision:* Sticker rules — one per glass ball; days with <3 glass balls
      grant remaining sticker(s) on the last glass completion; all glass done
      = gold star on the calendar day.
    * *Decision:* Forge timer keeps only Moon + pixel grid renderers.
      Timer works standalone when decoupled from a task.
    * *Decision:* Stop/timeout flow — Task Complete (sticker + celebration)
      or Still Needs Work (+15/+30/custom, or "Follow up: " roll-forward task
      via pre-filled creation screen).
    * *Decision:* Jokes v1 = text only. Mechanism + original/aphorism starter
      set shipped in code; show quotes (Arcane, Friends, Star Wars, ITYSL,
      SNL) are Chad/Joelle-curated data, never shipped in code. Library format
      built image-ready for the v2 meme library.
    * *Decision:* Design language is Glass Ball's own — `#FBFAF6`-ish cream
      white, black text, functional-with-personality type. House
      walnut/amber/Fraunces applies only to the tracker file.
    * *Decision:* Joelle is design authority; unsettled design questions are
      logged here as "pending Joelle," not defaulted.
    * *Decision:* Month report deprioritized for initial builds (stub OK).
    * *Decision:* Build tracker created (`glass-ball-tracker.html`) — initial
      priorities reflect Phase 0 scaffold/port, Phase 1 heart, and sync
      go-live across both repos.

* **[2026-08-14] (build session, Claude Code):** Separation surgery + Phase 0–2 core
  shipped as **v0.1.0** on `claude/glass-ball-task-app-n3izqt` in both repos.
    * *Founding lineage:* both repos imported from CTT at commit `d202183`
      (desktop v0.9.3 / mobile v0.9.2 line). Stripped: `src/gertie/`,
      `PJT-BACKPORT.md`, `HANDOFF.md`, macOS `build.yml`, `src-tauri/`
      (deleted — Joelle's surfaces are browser + iPhone PWA; a native wrap can
      return later with its own bundle id), Chiaro assets, all CTT trackers.
      Kept: LICENSE, the sync Worker (renamed), and the engineering scars.
    * *App:* fresh single-file `src/index.html` (not a transform of CTT's) with
      ported components: happy checkbox + spark burst, blueprint inline-entry
      pattern, focus timer (wall-clock countdown, wake lock, full-screen) with
      exactly Moon + pixel-grid faces, storage seam, import-undo buffer, KV
      sync client. Five rooms live: Opening (launch ramp, deep-links to Forge),
      Calendar (month grid + capped lists + notes + creation modal), Projects
      (steps + push-to-day bridge), The Forge (picker, time-block auto-load,
      start joke, complete / still-needs-work / follow-up, month report stub),
      Closing (stickers, gold star, "It was enough." check).
    * *Identity:* `STORE_KEY='glassball_v1'`, `SCHEMA='glassball-1'`,
      `KV_KEY='glassball_kv'`, sync-code prefix `GLASS1-`, Worker binding
      `GLASS_KV`, Worker file `sync/glass-sync-worker.js`, SW cache
      `glass-ball-v0.1.0`. Nothing can reach Chad's data.
    * *Decision:* recurring tasks materialize **lazily** per viewed day from
      `db.recurring` templates; deleting an instance tombstones that template on
      that day (`day.skipRecur`); a day at cap skips the instance silently —
      caps are hard. Edit one-vs-all occurrences stays parked.
    * *Decision:* stickers/gold stars are **derived** from task state
      (`dayInfo()`), never stored — the marker always mirrors real state.
    * *Decision:* start joke shows only when a task is attached; the standalone
      timer stays a quiet tool. Joke popups dismiss-to-start (X, Esc, and
      backdrop all begin the block — never blocks, never re-nags).
    * *Decision:* PWA companions (manifest, sw.js, icons) ship in **both**
      repos; the two `src/` trees are byte-identical at founding. Divergence
      begins only when mobile dogfooding demands it.
    * *Decision:* schema-lockstep suite created at `test/lockstep.test.js`
      (main repo; `npm test`), with `lockstep.yml` in both repos cloning the
      sibling (same-named branch first, else main). **Observed failing** on a
      deliberate one-sided `mergeDefaults` canary, then green after revert —
      the guard is proven, not assumed. (The CTT jsdom suite referenced in the
      work order didn't exist in the import; this suite was written fresh.)
    * *Provisional (pending Joelle):* palette — cream `#FBFAF6`, ink text,
      glass-blue `#39749B` accent, gold `#D9A21B` stickers/stars; glass rows =
      sheened blue edge, rubber rows = matte (never color alone); type = system
      humanist stack led by Avenir Next (webfont pick like Atkinson
      Hyperlegible still hers to make).
    * *Verified:* 32-check Chromium smoke suite (boot, caps enforced, sticker
      rules, deep link, joke → timer, stop → celebrate → quote, follow-up
      prefill, push-to-day, reload persistence, export strips sync) — all
      green, zero console errors. `node --check` clean on both script blocks.

* **[2026-08-14] v0.1.1 — journals & the switch/recover fold.** Sync went
  live same-day (Worker `glass-ball-sync`, journal `joelle`, both surfaces
  synced).
    * *Decision:* multiple journals under one Worker + secret are **supported
      on purpose** — "Create a new journal" / "Join & pull" switch which
      journal *this device* points at; the other cloud copies stay in KV under
      their IDs. One-journal-per-person remains the intent; the mechanism is
      the recovery/testing door (iOS storage eviction, new phone, corrupted
      blob → join back in or start fresh).
    * *Decision:* once connected, those blocks fold behind a **"Switch or
      recover a journal…"** carrot (Chad's call) — collapsed by default,
      first-run keeps them prominent. Everyday surface: status, sync code,
      backups. Recovery at the edges.
    * *Shipped as v0.1.1:* subtitle + JS header + SW cache
      (`glass-ball-v0.1.1`) bumped together, per convention; arrives silently
      on next online open.

* **[2026-08-14] v0.2.0 — the pre-Joelle release.** Everything on the list
  before her first real week:
    * *Decision (Chad):* every todo is a **ball**, everywhere — task modal,
      Forge picker, projects (no more "steps"), buttons, hints, guide. Code
      identifiers keep `task`; the language the app speaks is balls.
    * *New room:* **Dev Notes** (6th tab) — Joelle's direct line. Quick
      capture in the house list style; naming a note auto-opens a composer
      for details; the round ✓, the X, and the backdrop all SAVE (a jotted
      bug report never dies to a stray tap). Copy-all formats a numbered
      batch for a text message; Clear empties after sending. Synced +
      exported like everything else (`db.devnotes`, mergeDefaults lockstep).
    * *New:* **Joke library editor** (gear 🎭) — the door for the
      Chad/Joelle-curated show quotes. Two pools (start / finish), bulk add
      one-per-line, delete per-entry; entries sync and ride in backups.
      Shipped starters always play and never appear in the editor. Meme
      images stay a v2 slot ({text, img} format reserved) — likely hosted
      URLs, not embedded blobs, to spare localStorage/KV.
    * *Backlog first shots:* the **project bridge closes** — catching a ball
      that came from a project checks its step at home (and unchecking
      unchecks); **recurring edits** gain This-day-only vs All-future (name +
      minutes propagate to the template and not-yet-caught instances; day and
      priority always stay per-day) plus **End repeat** (stops the template,
      clears not-caught instances from that day forward, past days keep what
      happened); **month report** adds worked-vs-budgeted totals.
    * *Still deliberately untouched:* Closing refinement (waiting on real
      use), meme images (v2), sync conflict handling beyond last-write-wins.
    * *Verified:* 25-check Chromium suite (naming, recurring scope + end,
      bridge, dev-notes full loop, joke library, persistence) — green, zero
      console errors; lockstep suite green.

* **[2026-08-14] v0.3.0 — the meme library lands.** Chad wanted to build the
  library now (paste memes straight from an image search) with display polish
  later; both halves shipped, since a library feeding nothing is a trap.
    * *Three intake paths, all routed by section:* paste (⌘V/Ctrl-V anywhere in
      a pool), drag-and-drop onto its box, or "choose a photo" (the iOS path —
      Safari clipboard-into-a-div is unreliable, a file picker is not).
    * *Decision — compress on the way in:* 480px max edge, JPEG q0.62,
      transparency flattened to white. A phone photo becomes ~20–40KB. The db
      is ONE synced blob: every image is bandwidth on every push and a bite out
      of the ~5MB iOS grants a PWA. Not compressing was never an option.
    * *Decision — a hard ~1.2MB image cap with a visible meter*, refusing the
      add (and saying why) rather than silently bloating. The meter turns warn
      at 80%. If the library outgrows it: hosted images (R2) or a second KV
      key, **not** a fatter blob.
    * *Decision — pasted image ADDRESSES are stored as links* ({img:url}, zero
      bytes), including via the text box (an image URL typed into "add jokes"
      becomes a meme). Cheap, but hotlinks die; the UI says so, and a broken
      thumbnail dims itself instead of vanishing.
    * *Decision — minimal display shipped now:* popups paint the meme when the
      drawn entry has one; a meme-only entry simply has no caption. Polish
      (captions, sizing, pairing text+image) waits for real use.
    * *Scar fixed while here:* `persistLocal()` swallowed failed writes. Now a
      refused write says "NOT saved — storage full" in the save pill and
      explains the likely cause once. A silent save failure is the worst bug
      this app could have, and images make it reachable.
    * *Verified:* 25-check Chromium suite driving real paste/drop/file-pick
      events, compression bounds, section routing, cap refusal, delete, popup
      painting, and reload persistence — green, zero console errors.

* **[2026-08-14] v0.3.1 — the glass/rubber choice reads honestly.** Joelle's
  catch, on the phone: the priority segments used ◉ / ○ glyphs baked into the
  labels, which look exactly like radio buttons — so with Rubber selected, the
  Glass half still showed a *filled* ◉ and appeared chosen.
    * *Decision:* the motif becomes an actual ball, not a control glyph —
      glass is a small lit sphere, rubber is flat and matte (material, not
      colour, per the design language). Selection is carried by three signals
      at once: filled background, heavier border, and a ✓ that only the chosen
      segment shows. Unselected text goes muted.
    * *Also:* `aria-pressed` now tracks selection (the ball and ✓ are
      decorative), and one `segState()` helper owns "how a segment looks
      chosen" for all three segmented controls — priority, push-to-day, and
      the recurring-edit scope.
    * *Verified:* 12-check Chromium pass at iPhone width covering both states,
      the ✓ moving, fill/border deltas, aria flipping, and that saving still
      lands on the chosen priority.

* **[2026-08-14] v0.3.2 — the Opening announces itself as a dashboard.**
  Chad: the room needed to say "this is a glance," so it's obvious that
  adding and editing happen in the Calendar.
    * *Decision:* the title becomes **"Your <date> at a glance"** (the date
      bold, "at a glance" lighter) instead of a bare date, and the two doors
      out — Open the Calendar / Just the timer — move from the bottom of the
      page into a subheader directly under the title, over a rule. The
      look-here / edit-there split is now legible without scrolling, which
      matters most on the phone where the lists push everything down.
    * *Kept:* tapping a ball still deep-links straight into the Forge with its
      block loaded — the one-tap launch ramp is the whole point of this room,
      and the subheader line now says so out loud.

* **[2026-08-14] v0.3.3 — creation rows must never commit on a timer.**
  Joelle's report: in Dev Notes the composer popped open mid-word, right
  after the first space.
    * *Root cause:* `bindCommit()` (a 700ms debounce, built for auto-saving
      *edits*) was also wired to the *creation* rows. A normal thinking pause
      fired it. Chasing it turned up a worse, unreported instance of the same
      defect in the daily flow: typing "Buy milk" with a pause created a ball
      named **"milkBuy"** — the commit cleared the field and re-rendered the
      list while the remaining keystrokes were still arriving.
    * *Decision:* creation gets its own binding, `bindCreate()` — commits on
      **Enter or blur only**, never on a timer — while staying in the
      pending-flush registry so backgrounding on iOS still rescues what was
      typed. Edits keep the debounce; they don't re-render or clear a field,
      so they were never at risk.
    * *Decision (Chad):* Dev Notes drops inline typing altogether. The compose
      row is a **door, not a field**: one tap opens the composer with the
      title focused. No keyboard-then-modal flicker on the phone, and the
      pop-open-mid-word failure mode is structurally impossible. An untouched
      draft is discarded; anything typed is kept by ✓, X, or the backdrop.
    * *Verified:* 17-check Chromium pass replaying the exact typing-with-a-
      pause that produced "milkBuy", plus blur-commit, the iOS background
      flush, the full Dev Notes loop (open, save, discard-empty, edit,
      delete), and the project creation row.

## 🤔 Pending Joelle (open design calls)
* Body/UI typeface pick: Atkinson Hyperlegible vs. Karla vs. Alegreya Sans
  (or another direction she prefers)
* Glass vs. rubber visual treatment (must be distinct at a glance; not color
  alone)
* Sticker & gold star art direction
* App display name/branding ("The Glass Ball" working title)

## 💡 The Parking Lot (Future Ideas)
* Month report analytics (ahead/behind time-block budget) — mechanism stubbed
* Meme/image joke library (format is image-ready from v1)
* Projects ↔ Calendar bridge polish (push project steps to days as
  glass/rubber — basic version in v1, refinement later)
* Additional timer renderers (registry supports it)
* Recurring-task edge cases (edit one vs. all occurrences)
* Sync conflict handling beyond last-write-wins (revisit once both surfaces
  are live)
* Shared visibility for Chad (e.g., seeing Joelle's glass balls) — only if
  Joelle wants it
