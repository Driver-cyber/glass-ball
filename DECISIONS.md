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

* **[2026-08-14] v0.4.0 — pre-handoff polish, found by auditing rather than
  guessing.** Three real first-week failure modes, each reproduced before it
  was fixed.
    * **A running timer did not survive the app being closed.** iOS discards a
      backgrounded PWA routinely, and the bell lived in memory only — "start a
      30, check a text, come back" returned a dead 25:00 with the ball
      unloaded. *Decision:* persist the wall-clock `endAt` (plus label, ball
      reference, carry minutes) to a **device-local** key, `glassball_timer`,
      **never the synced db** — a timer running in her hand is not a fact
      about the desktop. Restored on boot; if it finished while she was away
      it comes back rung, with the honest question waiting. A saved timer
      pointing at a ball that has since been caught or deleted on the other
      device degrades to a standalone timer rather than resurrecting it.
      Written on state transitions only — the tick derives from `endAt`.
    * **A page left open past midnight kept reporting yesterday** ("today" is
      computed at render). Now re-checked on return-to-visible and once a
      minute; when the date has actually turned, the rooms repaint and a
      selected day that *was* today follows along. `_dayStamp` is stamped at
      load, not lazily — a page opened at 11:59pm whose first check lands
      after midnight would otherwise record the new day and never repaint.
    * **22px checkboxes were 22px thumb targets.** Hit areas grow to the 44px
      Apple asks for on coarse pointers, invisibly, without changing the drawn
      box; the ⋯ menu got the same.
    * *Housekeeping:* the v0.2.0 / v0.3.0 smoke suites were de-staled (they
      pinned exact version strings and the retired Dev Notes inline input) so
      they stay usable as regression suites. Both re-run green against v0.4.0.

* **[2026-08-14] v0.5.0 — the guide becomes a scrollytelling page.** Chad's
  call, modelled on his PJT scrolly page: the guide moves out of a modal and
  onto its own URL — `guide.html`, `/guide` on Pages — as a full-screen
  scroll-driven tour, mobile-polished first.
    * *Form:* the daylight edition of the PJT page's bones (sticky `100svh`
      pins, progress measured against the pin so the collapsing iPhone URL
      bar can't jitter it, one rAF loop, honest reduced-motion fallback) in
      Glass Ball's own language — cream field, ink type, glass-blue and gold
      light. Eight scenes: the orb hero → glass-vs-rubber (the rubber one
      bounces, with squash; the glass one is held) → the caps filling
      3-then-5 → six room cards → the moon running a block down with the
      clock → stickers landing then the gold star spinning in → the no-guilt
      pledge in huge type → "Go catch today." with the door back in.
    * *Decision:* every scene is **drawn live** — no screenshots. The app's
      visuals are simple shapes (balls, slots, the moon, stickers), so the
      page stays one self-contained file, never goes stale against the real
      UI, and caches for offline exactly like the app.
    * *Standalone-PWA safety:* a fixed "← the app" pill and a closing button
      both point at `./` — in an installed PWA there is no browser chrome, so
      a page without its own way back is a trap.
    * *Plumbing:* gear → Guide navigates to the page; the old in-app guide
      modal is retired. `sw.js` caches `guide.html` in the shell and routes
      offline navigations to the right page (an offline `/guide` visit used
      to get `index.html`).
    * *Two flaws caught by testing, not by eye:* the reduced-motion height
      reset lost the specificity war against the phone-height `#id !important`
      rules (motion-averse readers got 30k px of empty scroll — now reset by
      ID); and the rubber ball's bounce apex crossed the headline's
      word-arrival lane — box-height arithmetic was wrong because the flex
      column holds the tag too, so the amplitude is now capped by the
      **measured** gap at runtime, re-measured on real resizes. Verified by
      sweeping the whole scene at 3% steps on both widths (min gap 4px phone /
      15px desktop, and it still bounces).

* **[2026-08-14] v0.6.0 — carry forward: the → on every ball.** Chad's answer
  to the open "what happens to uncaught glass?" question, and a better one
  than the nudge I proposed: instead of the app surfacing yesterday's misses,
  *she* hands a ball to another day deliberately, and the day closes clean.
    * *Behaviour:* every unfinished ball row (Opening + Calendar, glass and
      rubber) gains a **→**. It opens a small sheet — **Tomorrow** in one tap,
      or pick a day. The ball **stays on today**, struck through and settled,
      showing "→ Sun, Aug 16"; a real ball lands on the target day
      (`carriedFrom` recorded). Nothing vanishes, nothing is left hanging.
    * *Decision — moving is not catching.* A moved ball earns **no sticker**
      and **holds back the gold star**: the star means "every glass ball
      caught", and per the founding rule a marker must mirror real state. The
      alternative (excluding moved balls from the tally so the day still
      stars) would let a month of gold stars mean nothing.
    * *Decision — but the day must still be able to close.* `dayInfo()` gains
      `moved` and `settled`; when every glass ball is caught-or-moved, Opening
      shows a quiet **settled banner** and Closing says "N caught, N moved
      forward on purpose. Nothing was dropped and nothing is hanging. Go
      rest." Peace comes from the placement, not from a false star.
    * *Decision — caps stay hard on the target day.* A full day refuses the
      move and says which day it is. Moving is not an escape hatch around the
      constraint; carried balls also still occupy their original day's slot,
      because the cap governs what you *committed to*, not what you finished.
    * *Undo:* tapping the → badge on a settled ball offers **Bring it back** —
      it removes the copy (only if still uncaught over there) and re-opens the
      ball here. A mis-tap on a phone is real.
    * *Schema (lockstep):* `task.carried` / `task.carriedFrom`, normalized
      onto legacy balls in `mergeDefaults()`.
    * *DOM-clarity fix found by the regression suite:* the new → initially
      shared the `.row-menu` class with ⋯, so that selector silently meant two
      things and the old suite clicked the wrong ball's menu. The carry button
      now has its own `.row-carry`; styling is shared explicitly.
    * *Pending Joelle:* whether a deliberately-moved day should earn some
      marker of its own (a quiet "settled" mark, distinct from gold) — logged
      rather than invented.
    * *Verified:* 21-check carry suite (settled record, real landing, sticker
      and star honesty, banner + Closing copy, cap refusal, bring-back both
      sides, past-date refusal, legacy normalization) plus both prior suites
      re-run green.

* **[2026-08-15] v0.7.0 — the navigation catches up to the app.** Chad's
  call, and the right one: *"the navigation has been outgrown a little bit by
  the awesome functionality."* Five tabs were describing an app we no longer
  had — Opening and Calendar rendered the same day's lists twice, and the
  Forge was a room you had to travel to in order to do a thing you'd already
  chosen. **This supersedes the founding five-tab spec** (see 2026-08-14).
    * *Decision — three rooms: **Today · Projects · Closing**.* Opening and
      Calendar merge into one Today surface: the glance and today's balls up
      top (what matters now), the month below (planning), and any *other* day
      you tap opens in a framed panel beneath the calendar. Today never moves,
      so "today" and "some other day" can never be confused — the thing the
      old two-tab split was protecting, without the duplication.
    * *Decision — the timer is a **mode**, not a room.* The Forge pane is
      gone. The focus timer runs in an overlay reachable from anywhere (⏳ in
      the header, or ▶ on any ball), and a **timer bar** rides along at the
      bottom while a block runs, from whatever room she's in. Closing the face
      never stops the clock; tapping the bar reopens it. The month report,
      which never belonged in a workspace, moved to Closing.
    * *Decision — one ball, one tap.* Tapping anywhere on a ball opens a
      **sheet** with the three verbs a ball can take — **▶ Start it · ✓ Catch
      it · → Move it forward** — plus **✎ Edit details** and a quiet delete.
      The row full of ⋯ and → buttons is retired; a row is now a name, its
      minutes, its sticker, and a chevron.
    * *The one exception:* the **checkbox stays a direct tap on the row**.
      Catching is the most frequent act and the best feeling in the app; it
      never gets buried behind a menu. (First cut of the row rewrite let the
      check bubble up and open the sheet too — caught by the ported v0.2.0
      suite, fixed by swallowing the click at the check.)
    * *Consequence — inline rename is gone from the row.* An existing ball's
      name is now a label, not an input, so the whole row is one clean target;
      renaming lives in ✎ Edit details. Inline *entry* (typing into the empty
      line to add) is untouched — that's the blueprint pattern and it stays.
    * *Fix:* the strike-through drew a rule out into empty space past the
      words, because it lived on the row-filling label. It now lives on the
      name itself.
    * *No schema change* — v0.7.0 is navigation only, so the siblings stay in
      lockstep by construction. Guard re-proved by canary (one-sided
      `mergeDefaults` field → test 5 red → reverted → green).
    * *Verified:* new 52-check v0.7.0 flow suite (three rooms, one Today
      scroll, sheet verbs, timer-as-mode incl. the bar across rooms, carry via
      the sheet, other-day panel, standalone timer, report in Closing,
      persistence) plus the v0.2.0, v0.3.0 and carry suites ported to the new
      navigation and re-run green. Zero console errors.

* **[2026-08-15] v0.8.0 — the ball pit: a shelf two journals share.** Chad's
  idea, and the app's first multi-person surface. Joelle and Chad each keep
  their own journal; a shared "pit" sits between them. **Journal IDs gate the
  personal boards; the Sync code carries the pit.**
    * *Why it earns its place (Juggler's Test):* it helps catch glass, because
      a ball with no day yet stops being a loose thought — park it, schedule it
      on a Friday planning pass. And it lets rubber bounce, because nothing in
      it counts at you.
    * *Decision — two sync algorithms, deliberately.* A journal is one person's
      document, so blob last-write-wins is correct. The pit is **two** people's
      document, where LWW silently drops whichever save lost the race — the one
      bug that would matter in an app promising nothing falls off. So the pit
      merges **per item**: union the ids, newer `lastEdit` wins, tombstones for
      deletes. That merge is **convergent** (commutative + idempotent), so both
      sides land on identical state whatever order they sync in, it needs no
      conflict dialog, and it cannot lose a ball. *Never simplify it onto LWW.*
    * *Decision — everyone involved gets a sticker* (Chad's call). Catching
      fills a real slot as always. If someone **else** catches a ball you put in
      the pit, you earn a **bonus sticker**: outside the three slots, in its own
      dashed shape, titled with who caught it. So a day can show more than three
      stickers while never holding more than three glass balls.
    * *Decision — but bonus stickers stay outside the gold-star test.* ★ still
      means "every glass ball on my day, caught." A ball caught out of the pit
      *is* genuinely done, so it counts for the day it's on; a gift for a ball
      on someone else's day does not manufacture a star. Same rule that governed
      carry-forward: a marker must mirror real state.
    * *Decision — the caps are untouched.* Taking a ball off the shelf goes
      through the ordinary creation form and the ordinary hard 3/5; a full day
      refuses it and says so. Shared work is not an escape hatch around the
      constraint that is the product.
    * *Decision — a shelf, never an inbox.* Collapsed by default, no badge, no
      count on Today. This is the guardrail that lets a multi-person feature
      live in an anti-engagement app: an unbounded pile that counts at you is
      exactly the "undefined, therefore endless" dread the constitution names.
    * *Decision — transparency over privacy, knowingly* (Chad's call). Sharing
      a pit means sharing one `SYNC_SECRET`, so either journal could read the
      other's given its ID. Between Chad and Joelle that is a **feature**: the
      pit is async communication — "check ball 4" instead of finding time to
      explain a request out loud. Not a default to extend beyond the two of them.
    * *Decision — a pasted Sync code now asks what it is.* It carries both a
      journal and a pit, and guessing wrong would replace someone's whole board,
      so the app asks: "my own other device" (join both) or "my partner's" (join
      the pit only, keep my journal).
    * *Schema (lockstep):* `db.pit {id,name,me,items,lastSync}` plus
      `task.pitId` / `task.caughtBy`, normalized onto legacy balls.
    * *DOM-clarity fix, same genus as v0.6.0's `.row-menu`:* the new Share verb
      shifted the sheet's `nth-of-type(4)`, so the ported v0.2.0 suite clicked
      Share where it meant Edit. Fixed in the app with a stable `#bsEdit`, not
      in the test — positional selectors are the smell.
    * *Verified:* a dedicated **16-test merge suite** asserting union,
      newer-wins, no-stale-uncatch, commutativity, idempotence, deterministic
      tie-breaks, tombstone propagation + expiry, junk rejection, and stable
      ordering — every property run against **both repos' copies** of
      `pitMerge`, plus a 60-item randomised exchange. Guard proved by two
      canaries: a broken tie-break (subtle) and a dropped-unseen-item merge
      (catastrophic) each turn it red. Plus a **43-check end-to-end suite** with
      `fetch` stubbed to an in-memory KV so a simulated partner writes the shelf
      between calls — his catch closing her copy, her parked ball surviving his
      write, caps refusing a shared ball, tombstones not deleting anyone's day,
      leaving the pit keeping her days. All four prior suites re-run green.

* **[2026-08-15] v0.8.1 — the guide grows a story.** Chad's brief: a
  marketing-style scrolly demo — what the app is, what it does, how you move
  through it, stated plainly — with a gentle narrative the viewer can step
  into ("we've all got these chores"), never a poem that obscures the product.
    * *The arc:* the noise (a rain of gray urgency piling up — with **one
      glass ball hidden in the heap** and a wink: "did you spot it?" — the
      reader plays the game before they're taught it) → the idea → the caps →
      **how it works** (a live-drawn Today card: rows arrive, a checkbox draws
      its check, strike sweeps, sticker pops, the ball sheet opens — "Type it.
      Tap it. That's the manual.") → the timer with its **joke on display**
      (a real shipped line: "Somewhere a version of you already finished this.
      Go meet her.") → **the ball pit** (a shelf row flips from "from you" to
      "caught by Chad," bonus ✧ pops — "Asking for help, minus the asking.") →
      the game → the house recap → the pledge → the door.
    * *Decision — features stay load-bearing.* Every scene's kicker names the
      feature; the feeling rides in the copy, not instead of it. The voice is
      wry second-person ("The dentist you meant to call in March"), because
      the audience is anyone who procrastinates chores — i.e., everyone.
    * *Same proven bones:* sticky 100svh pins, progress measured from the pin
      (URL-bar-proof), one rAF loop, scenes drawn live, reduced-motion
      fallback extended to every new element (verified: 7.4k-px static page,
      catch states resolved, joke visible).
    * *Version:* v0.8.1 — app unchanged, but the subtitle/JS-header/SW-cache
      trio bumps together so installed PWAs refresh their offline guide shell.
    * *Verified:* per-scene screenshots at money-beats, phone + desktop, zero
      console errors; reduced-motion assertions; all five app suites re-run
      green (43/52/26/25/8) + lockstep 16/16.

## 🤔 Pending Joelle (open design calls)
* Body/UI typeface pick: Atkinson Hyperlegible vs. Karla vs. Alegreya Sans
  (or another direction she prefers)
* Glass vs. rubber visual treatment (must be distinct at a glance; not color
  alone)
* Sticker & gold star art direction
* App display name/branding ("The Glass Ball" working title)
* Should a fully-*settled* day (all glass caught or deliberately moved) earn a
  marker of its own, distinct from the gold star? Today it earns a quiet
  banner and no star.
* Bonus-sticker art: they currently render as a dashed ✧ after a "+" separator,
  distinct from the solid ✦ slots. Her call whether a gift should look like
  that, or like something else entirely.
* Whether the pit wants a "just for me" lane (parked balls nobody else sees) or
  whether everything on the shelf being shared is the point.

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
