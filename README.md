# Cardsmith

[![build](https://github.com/keerthishree20/cardsmith/actions/workflows/build.yml/badge.svg)](https://github.com/keerthishree20/cardsmith/actions/workflows/build.yml)

Turn notes into flashcards, then review them the day before you'd forget.

**Live site:** https://keerthishree20.github.io/cardsmith/

A spaced repetition system that runs entirely in your browser. No account, no server,
no sync — your decks and your whole review history live in `localStorage`, and a backup
is one JSON file.

## What it does

- **Write cards, or generate them.** Paste notes and have Claude draft the deck, or write
  cards by hand. `{{c1::cloze deletions}}` expand into one card per index.
- **A real scheduler.** SM-2: two learning steps, ease starting at 2.50 with a 1.30 floor,
  lapses that shorten every future interval. Each grade button prints the interval it will
  actually produce before you press it.
- **Search across every deck.** `tag:os`, `is:leech`, `is:suspended`, `ease<2.0`,
  `lapses>3`, `is:cloze`, or plain text. Select results to tag, suspend, move, delete, or
  cram them.
- **Cram runs** walk a set of cards without touching their schedule or your statistics.
- **Progress dashboard.** A 14-day workload forecast, a 12-week activity heatmap, card
  maturity, recall rate, streak, and per-deck ease.
- **Per-deck settings.** New cards per session, learning steps, review order.
- **Undo** the last answer with `ctrl+z` — the schedule change and the log entry both roll back.
- **Portable decks.** Share a deck as a `CSMITH1.` code, import CSV/TSV, export CSV that
  Anki reads, back up everything as JSON.

## Keyboard

| Key | Action |
|---|---|
| `space` | show the answer |
| `1` `2` `3` `4` | Again / Hard / Good / Easy |
| `ctrl+z` | undo the last answer |

## Build

`cardsmith.html` is the single source of truth. It is written as Artifact body content —
the claude.ai viewer supplies the doctype, head and a small CSS reset around it.

```
node build.js      # wraps the same source into docs/index.html for GitHub Pages
```

GitHub Pages serves `docs/` on the default branch.

## Where it runs

The page works standalone, and lights up extra abilities when it is opened inside the
Claude viewer:

| Feature | Website | Claude artifact |
|---|---|---|
| Review, search, cloze, stats, import/export | yes | yes |
| Generate cards from pasted notes | no | yes (uses the viewer's Claude account) |
| File saving | browser download | the viewer's download prompt |

Storage is per browser and per origin, so the website and the artifact keep separate decks.
Move between them with a JSON backup or a deck code.

## License

MIT
