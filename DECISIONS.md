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
