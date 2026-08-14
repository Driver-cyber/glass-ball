# The Glass Ball

**Joelle's task & schedule app — catch the glass, let the rubber bounce.**

Some tasks are **glass balls**: drop them and something real breaks (school
enrollment before the deadline). Most are **rubber balls**: they feel urgent,
but they bounce back fine tomorrow (the dishes). Glass Ball is built on the
honest version of that distinction — max **3 glass** and **5 rubber** per day,
stickers and a gold star when the glass is caught, and zero guilt for whatever
bounces.

Five rooms: **Opening · Calendar · Projects · The Forge · Closing.**

## The pair

| Repo | Surface |
|---|---|
| `Driver-cyber/glass-ball` (this repo) | Main repo, desktop-browser primary |
| `Driver-cyber/glass-ball-mobile` | iPhone-primary PWA — Joelle's daily driver |

Both are single-file vanilla HTML apps (`src/index.html`) sharing one schema
and one Cloudflare KV namespace through the sync Worker in [`sync/`](./sync/)
— two views of the same data. Schema changes land in both repos together
(see `CLAUDE.md`, Schema lockstep).

Sibling to [Chiaro Tinker Tools](https://github.com/Driver-cyber/chiaro-tinker-tools),
from which it ports its components and inherits its engineering scars — but a
fully separate app: different data, different Worker, different secret,
different soul.

## Running it

Open `src/index.html` in a browser. That's the whole build step. Deploys via
Cloudflare Pages from `main`.

## Docs

- `CLAUDE.md` — project constitution
- `DECISIONS.md` — decision log & parking lot
- `glass-ball-tracker.html` — build tracker (current priorities)
- `sync/SYNC-SETUP.md` — one-time Cloudflare KV sync setup

*Built by Chad, for Joelle, co-designed by both. Catch the glass. Let the
rubber bounce.*
